import { prisma } from "@/configs"
import { IBoardJoinLinkRepository } from "../intefaces/IBoardJoinLinkRepository";
import { BoardJoinLink } from "@prisma/client";

export default class BoardJoinLinkRepository implements IBoardJoinLinkRepository {
  async createLink(token: string, boardId: string, userId: string): Promise<BoardJoinLink> {
    return prisma.boardJoinLink.create({
      data: {
        token: token,
        boardId: boardId,
        createdById: userId,
        expiresAt: new Date(Date.now() + 15*60*1000),
        isRevoke: false
      }
    });
  }

  async revokeLink(token: string): Promise<BoardJoinLink>{
    return prisma.boardJoinLink.update({
      where: { token: token},
      data: {
        isRevoke: true
      }
    })
  }
}