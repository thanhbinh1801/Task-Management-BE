import { BoardMember } from "@prisma/client";

export interface IMemberBoardRepository {
  addMemberBoard(email: string, boardId: string): Promise<BoardMember | null>;
  getMember(boardId: string): Promise<BoardMember[] | null>;
  updateMember(boardId: string, userId: string, role: string): Promise<BoardMember | null>;
  removeMember(boardId: string, userId: string): Promise<BoardMember | null>;
  getEmailAndBoardIdByLink(token: string): Promise<{ email: string | null; boardId: string | null }>;
}