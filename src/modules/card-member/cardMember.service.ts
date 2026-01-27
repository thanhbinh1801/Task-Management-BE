import { BadRequestException, ConflictException, NotFoundException } from "@/commons";
import { redisService } from "@/modules/redis/redis.service";
import { boardKey } from "@/modules/board/board.service";
import { cardKey } from "@/modules/card/card.service";
import { CardMemberAssignRequest } from "./dtos/requests/cardMember.request";
import { CardMemberResponse } from "./dtos/responses/cardMember.response";
import { ICardMemberRepository } from "./repository/interfaces/ICardMemberRepository";

export class CardMemberService {
  constructor(private readonly cardMemberRepo: ICardMemberRepository) {}

  async ensureCard(cardId: string) {
    const card = await this.cardMemberRepo.findCardWithBoard(cardId);
    if (!card) {
      throw new NotFoundException("Card not found");
    }
    return card;
  }

  private async ensureUser(userId: string) {
    const user = await this.cardMemberRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  private async ensureBoardMembership(userId: string, boardId: string) {
    const isMember = await this.cardMemberRepo.findBoardMember(userId, boardId);
    if (!isMember) {
      throw new BadRequestException("User is not a member of this board");
    }
  }

  private async clearCaches(boardId: string, cardId: string) {
    try {
      await Promise.all([
        redisService.del(boardKey(boardId)),
        redisService.del(cardKey(cardId)),
      ]);
    } catch (err) {
      console.error("card member cache clear error", err);
    }
  }

  async getMembers(cardId: string): Promise<{ boardId: string; members: CardMemberResponse[] }> {
    const card = await this.ensureCard(cardId);
    const members = await this.cardMemberRepo.getCardMembers(cardId);
    return { boardId: card.boardId, members };
  }

  async assignMember(cardId: string, payload: CardMemberAssignRequest): Promise<string> {
    const card = await this.ensureCard(cardId);
    await this.ensureUser(payload.userId);
    await this.ensureBoardMembership(payload.userId, card.boardId);

    const existed = await this.cardMemberRepo.findCardMember(cardId, payload.userId);
    if (existed) {
      throw new ConflictException("User is already assigned to this card");
    }

    await this.cardMemberRepo.assignMember(cardId, payload.userId);
    await this.clearCaches(card.boardId, cardId);
    return card.boardId;
  }

  async removeMember(cardId: string, userId: string): Promise<string> {
    const card = await this.ensureCard(cardId);
    await this.ensureBoardMembership(userId, card.boardId);

    const existing = await this.cardMemberRepo.findCardMember(cardId, userId);
    if (!existing) {
      throw new NotFoundException("User is not assigned to this card");
    }

    await this.cardMemberRepo.removeMember(cardId, userId);
    await this.clearCaches(card.boardId, cardId);
    return card.boardId;
  }
}
