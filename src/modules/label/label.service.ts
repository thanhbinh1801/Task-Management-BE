import { BadRequestException, ConflictException, InternalServerException, NotFoundException } from "@/commons";
import { boardKey } from "@/modules/board/board.service";
import { redisService } from "@/modules/redis/redis.service";
import { Label } from "@prisma/client";
import { CardLabelAssignRequest, LabelCreateRequest, LabelUpdateRequest } from "./dtos/requests/label.request";
import { LabelResponse } from "./dtos/responses/label.response";
import { ILabelRepository } from "./repository/interfaces/ILabelRepository";

const labelPerBoardKey = (boardId: string) => `label:board:${boardId}`;
const cardCacheKey = (cardId: string) => `card:${cardId}`;
const LABEL_TTL_SECONDS = 300;

export class LabelService {
  constructor(private readonly labelRepo: ILabelRepository) {}

  private async ensureBoard(boardId: string) {
    const board = await this.labelRepo.findBoardById(boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }
    return board;
  }

  private async ensureLabel(boardId: string, labelId: string) {
    const label = await this.labelRepo.findLabelById(labelId);
    if (!label) {
      throw new NotFoundException("Label not found");
    }

    if (label.boardId !== boardId) {
      throw new BadRequestException("Label does not belong to this board");
    }

    return label;
  }

  private async ensureCard(boardId: string, cardId: string) {
    const card = await this.labelRepo.findCardWithBoard(cardId);
    if (!card) {
      throw new NotFoundException("Card not found");
    }

    if (card.boardId !== boardId) {
      throw new BadRequestException("Card does not belong to this board");
    }

    return card;
  }

  private async clearBoardCaches(boardId: string) {
    try {
      await redisService.del(labelPerBoardKey(boardId));
      await redisService.del(boardKey(boardId));
    } catch (err) {
      console.error("label board cache clear error", err);
    }
  }

  private async clearCardCache(cardId: string) {
    try {
      await redisService.del(cardCacheKey(cardId));
    } catch (err) {
      console.error("label card cache clear error", err);
    }
  }

  async createLabel(boardId: string, payload: LabelCreateRequest): Promise<Label> {
    await this.ensureBoard(boardId);

    const label = await this.labelRepo.createLabel(boardId, payload);
    if (!label) {
      throw new InternalServerException("Cannot create label");
    }

    await this.clearBoardCaches(boardId);
    return label;
  }

  async getBoardLabels(boardId: string): Promise<LabelResponse[]> {
    await this.ensureBoard(boardId);
    const cacheKey = labelPerBoardKey(boardId);

    try {
      const cached = await redisService.get<LabelResponse[]>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error("label list cache get error", err);
    }

    const labels = await this.labelRepo.findLabelsByBoard(boardId);

    try {
      await redisService.set(cacheKey, labels, LABEL_TTL_SECONDS);
    } catch (err) {
      console.error("label list cache set error", err);
    }

    return labels;
  }

  async updateLabel(boardId: string, labelId: string, payload: LabelUpdateRequest): Promise<Label> {
    await this.ensureBoard(boardId);
    await this.ensureLabel(boardId, labelId);

    const label = await this.labelRepo.updateLabel(labelId, payload);
    if (!label) {
      throw new InternalServerException("Cannot update label");
    }

    await this.clearBoardCaches(boardId);
    return label;
  }

  async deleteLabel(boardId: string, labelId: string): Promise<void> {
    await this.ensureBoard(boardId);
    await this.ensureLabel(boardId, labelId);

    const deleted = await this.labelRepo.softDeleteLabel(labelId);
    if (!deleted) {
      throw new InternalServerException("Cannot delete label");
    }

    await this.clearBoardCaches(boardId);
  }

  async getLabelsOfCard(boardId: string, cardId: string): Promise<LabelResponse[]> {
    await this.ensureCard(boardId, cardId);
    return this.labelRepo.getCardLabels(cardId);
  }

  async assignLabelToCard(boardId: string, cardId: string, payload: CardLabelAssignRequest): Promise<void> {
    await this.ensureCard(boardId, cardId);
    const label = await this.ensureLabel(boardId, payload.labelId);

    if (label.deletedAt) {
      throw new ConflictException("Label has been deleted");
    }

    await this.labelRepo.assignLabelToCard(cardId, payload.labelId);
    await this.clearBoardCaches(boardId);
    await this.clearCardCache(cardId);
  }

  async removeLabelFromCard(boardId: string, cardId: string, labelId: string): Promise<void> {
    await this.ensureCard(boardId, cardId);
    await this.ensureLabel(boardId, labelId);

    const existing = await this.labelRepo.findCardLabel(cardId, labelId);
    if (!existing) {
      throw new NotFoundException("Label is not assigned to this card");
    }

    await this.labelRepo.removeLabelFromCard(cardId, labelId);
    await this.clearBoardCaches(boardId);
    await this.clearCardCache(cardId);
  }
}
