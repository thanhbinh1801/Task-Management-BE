import { ForbiddenException } from "@/commons";
import IJoinLinkRepository from "../interfaces/IJoinLinkRepository";
import { JoinLinkResult } from "../interfaces/IJoinLinkRepository";
import { prisma } from "@/configs";

export default class JoinLinkPrismaRepository implements IJoinLinkRepository {
  async checkToken(token: string): Promise<JoinLinkResult | null> {
    const wslink = await prisma.workspaceJoinLink.findUnique({
      where: {token: token} ,
      include: {
        workspace: { select: { id: true, name: true}},
      },
    });
    if(wslink) {
      if(wslink.isRevoke) {
        throw new ForbiddenException('This link has been revoked.');
      }
      if(wslink.expiresAt < new Date()) {
        throw new ForbiddenException('This link has expired.');
      }
      return { scope: "WORKSPACE", link: wslink, id: wslink.workspaceId}
    }

    const blink = await prisma.boardJoinLink.findUnique({
      where: { token: token},
      include: {
        board: { select: { id: true, name: true}}
      },
    });
    if(blink){
      if(blink.isRevoke) {
        throw new ForbiddenException('This link has been revoked.');
      }
      if(blink.expiresAt < new Date()) {
        throw new ForbiddenException('This link has expired.');
      }
      return { scope: "BOARD", link: blink, id: blink.boardId};
    }

    return null;
  }
}