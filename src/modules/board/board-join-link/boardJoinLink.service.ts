import { BoardJoinLink } from "@prisma/client";
import { randomBytes } from "crypto";
import { IBoardJoinLinkRepository } from "./repositories/intefaces/IBoardJoinLinkRepository";
import { InternalServerException } from "@/commons";

export default class BoardJoinLinkService {
  constructor(private readonly boardJoinLinkRepo: IBoardJoinLinkRepository){}

  async createLink(boardId: string, userId: string): Promise<BoardJoinLink> {
    const token = randomBytes(24).toString("hex");
    const newLink = await this.boardJoinLinkRepo.createLink(token, boardId, userId);
    if( !newLink) {
      throw new InternalServerException("can not create link to join board");
    }
    return newLink;
  }

  async revokeLink(linkId: string) : Promise<void> {
    const isRevoke = await this.boardJoinLinkRepo.revokeLink(linkId);
    if(!isRevoke) {
      throw new InternalServerException("Can not revoke link to join board");
    }
  }
}