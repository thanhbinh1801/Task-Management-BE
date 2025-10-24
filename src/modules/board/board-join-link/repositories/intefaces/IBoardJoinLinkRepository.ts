import { BoardJoinLink } from "@prisma/client";

export interface IBoardJoinLinkRepository {
  createLink(token: string, boardId: string, userId: string): Promise<BoardJoinLink>;
  revokeLink(token: string): Promise<BoardJoinLink>;
}