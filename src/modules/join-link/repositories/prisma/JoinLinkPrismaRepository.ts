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
      return { scope: "WORKSPACE", link: wslink}
    }

    const blink = await prisma.boardJoinLink.findUnique({
      where: { token: token},
      include: {
        board: { select: { id: true, title: true}}
      },
    });
    if(blink){
      return { scope: "BOARD", link: blink};
    }

    return null;
  }

  // async join(token: string, scope: JoinLinkScope) : Promise<boolean>{

  // }
}