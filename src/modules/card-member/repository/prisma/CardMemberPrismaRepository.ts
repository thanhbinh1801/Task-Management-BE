import { prisma } from "@/configs";
import { ConflictException } from "@/commons";
import { CardMember } from "@prisma/client";
import { CardMemberResponse } from "../../dtos/responses/cardMember.response";
import { ICardMemberRepository } from "../interfaces/ICardMemberRepository";

export class CardMemberPrismaRepository implements ICardMemberRepository {
  async findCardWithBoard(cardId: string): Promise<{ id: string; boardId: string } | null> {
    const card = await prisma.card.findFirst({
      where: { id: cardId, deletedAt: null },
      select: { id: true, list: { select: { boardId: true } } },
    });

    if (!card) return null;
    return { id: card.id, boardId: card.list.boardId };
  }

  async findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, avatarUrl: true },
    });
  }

  async findBoardMember(userId: string, boardId: string): Promise<boolean> {
    const member = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId, boardId } },
    });
    return !!member;
  }

  async findCardMember(cardId: string, userId: string): Promise<CardMember | null> {
    return prisma.cardMember.findUnique({
      where: { userId_cardId: { userId, cardId } },
    });
  }

  async getCardMembers(cardId: string): Promise<CardMemberResponse[]> {
    const members = await prisma.cardMember.findMany({
      where: { cardId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { assignedAt: "asc" },
    });

    return members.map((member) => ({
      userId: member.userId,
      cardId: member.cardId,
      assignedAt: member.assignedAt,
      user: {
        id: member.user.id,
        email: member.user.email,
        fullName: member.user.name,
        avatar: member.user.avatarUrl,
      },
    }));
  }

  async assignMember(cardId: string, userId: string): Promise<CardMember> {
    const existed = await this.findCardMember(cardId, userId);
    if (existed) {
      throw new ConflictException("User is already assigned to this card");
    }

    return prisma.cardMember.create({
      data: {
        cardId,
        userId,
      },
    });
  }

  async removeMember(cardId: string, userId: string): Promise<CardMember> {
    return prisma.cardMember.delete({
      where: { userId_cardId: { userId, cardId } },
    });
  }
}
