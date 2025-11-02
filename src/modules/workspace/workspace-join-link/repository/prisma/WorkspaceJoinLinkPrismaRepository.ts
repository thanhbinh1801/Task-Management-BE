import { prisma } from "@/configs"
import { IWorkspaceJoinLinkRepository } from "../intefaces/IWorkspaceJoinLinkRepository";
import { WorkspaceJoinLink } from "@prisma/client";

export default class WorkspaceJoinLinkRepository implements IWorkspaceJoinLinkRepository {
  async createLink(token: string, workspaceId: string, userId: string): Promise<WorkspaceJoinLink> {
    return prisma.workspaceJoinLink.create({
      data: {
        token: token,
        workspaceId: workspaceId,
        createdById: userId,
        expiresAt: new Date(Date.now() + 15*60*1000),
        isRevoke: false
      }
    });
  }

  async revokeLink(token: string): Promise<WorkspaceJoinLink>{
    return prisma.workspaceJoinLink.update({
      where: { token: token},
      data: {
        isRevoke: true
      }
    })
  }
}