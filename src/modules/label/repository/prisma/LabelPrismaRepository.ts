import { ConflictException } from "@/commons";
import { prisma } from "@/configs";
import { CardLabel } from "@prisma/client";
import { LabelCreateRequest, LabelUpdateRequest } from "../../dtos/requests/label.request";
import { LabelResponse } from "../../dtos/responses/label.response";
import { ILabelRepository } from "../interfaces/ILabelRepository";

export class LabelPrismaRepository implements ILabelRepository {
  async findBoardById(boardId: string) {
    return prisma.board.findFirst({
      where: { id: boardId, deletedAt: null, isTemplate: false },
    });
  }

  async createLabel(boardId: string, data: LabelCreateRequest) {
    return prisma.label.create({
      data: {
        name: data.name,
        color: data.color,
        boardId,
      },
    });
  }

  async findLabelsByBoard(boardId: string): Promise<LabelResponse[]> {
    const labels = await prisma.label.findMany({
      where: { boardId, deletedAt: null },
      orderBy: { createdAt: "asc" },
    });

    return labels.map((label) => ({
      id: label.id,
      name: label.name,
      color: label.color,
      boardId: label.boardId,
      createdAt: label.createdAt,
      updatedAt: label.updatedAt,
    }));
  }

  async findLabelById(labelId: string) {
    return prisma.label.findFirst({
      where: { id: labelId, deletedAt: null },
    });
  }

  async updateLabel(labelId: string, data: LabelUpdateRequest) {
    return prisma.label.update({
      where: { id: labelId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.color && { color: data.color }),
      },
    });
  }

  async softDeleteLabel(labelId: string) {
    return prisma.$transaction(async (tx) => {
      await tx.cardLabel.deleteMany({ where: { labelId } });

      return tx.label.update({
        where: { id: labelId },
        data: { deletedAt: new Date() },
      });
    });
  }

  async findCardWithBoard(cardId: string) {
    const card = await prisma.card.findFirst({
      where: { id: cardId, deletedAt: null },
      select: { id: true, listId: true, list: { select: { boardId: true } } },
    });

    if (!card) return null;

    return { id: card.id, listId: card.listId, boardId: card.list.boardId };
  }

  async getCardLabels(cardId: string): Promise<LabelResponse[]> {
    const labels = await prisma.cardLabel.findMany({
      where: { cardId, label: { deletedAt: null } },
      include: { label: true },
      orderBy: { createdAt: "asc" },
    });

    return labels.map((label) => ({
      id: label.label.id,
      name: label.label.name,
      color: label.label.color,
      boardId: label.label.boardId,
      createdAt: label.label.createdAt,
      updatedAt: label.label.updatedAt,
    }));
  }

  async findCardLabel(cardId: string, labelId: string) {
    return prisma.cardLabel.findUnique({
      where: { cardId_labelId: { cardId, labelId } },
    });
  }

  async assignLabelToCard(cardId: string, labelId: string): Promise<CardLabel> {
    const existed = await this.findCardLabel(cardId, labelId);
    if (existed) {
      throw new ConflictException("Label already assigned to card");
    }

    return prisma.cardLabel.create({
      data: { cardId, labelId },
    });
  }

  async removeLabelFromCard(cardId: string, labelId: string): Promise<CardLabel> {
    return prisma.cardLabel.delete({
      where: { cardId_labelId: { cardId, labelId } },
    });
  }
}
