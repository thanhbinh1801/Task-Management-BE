import { CardMember } from "@prisma/client";
import { CardMemberResponse } from "../../dtos/responses/cardMember.response";

export interface ICardMemberRepository {
  findCardWithBoard(cardId: string): Promise<{ id: string; boardId: string } | null>;
  findUserById(userId: string): Promise<{ id: string; email: string; name: string | null; avatarUrl: string | null } | null>;
  findBoardMember(userId: string, boardId: string): Promise<boolean>;
  findCardMember(cardId: string, userId: string): Promise<CardMember | null>;
  getCardMembers(cardId: string): Promise<CardMemberResponse[]>;
  assignMember(cardId: string, userId: string): Promise<CardMember>;
  removeMember(cardId: string, userId: string): Promise<CardMember>;
}
