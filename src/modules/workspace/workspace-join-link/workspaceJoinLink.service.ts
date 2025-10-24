import { WorkspaceJoinLink } from "@prisma/client";
import { randomBytes } from "crypto";
import { IWorkspaceJoinLinkRepository } from "./repository/intefaces/IWorkspaceJoinLinkRepository";
import { InternalServerException } from "@/commons";

export default class WorkspaceJoinLinkService {
  constructor(private readonly workspaceJoinLinkRepo: IWorkspaceJoinLinkRepository){}

  async createLink(workspaceId: string, userId: string): Promise<WorkspaceJoinLink> {
    const token = randomBytes(24).toString("hex");
    const newLink = await this.workspaceJoinLinkRepo.createLink(token, workspaceId, userId);
    if( !newLink) {
      throw new InternalServerException("can not create link to join workspace");
    }
    return newLink;
  }

  async revokeLink(linkId: string) : Promise<void> {
    const isRevoke = await this.workspaceJoinLinkRepo.revokeLink(linkId);
    if(!isRevoke) {
      throw new InternalServerException("Can not revoke link to join workspace")
    }
  }
}