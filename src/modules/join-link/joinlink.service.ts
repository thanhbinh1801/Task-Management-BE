import { InternalServerException } from "@/commons";
import IJoinLinkRepository from "./repositories/interfaces/IJoinLinkRepository";
import { JoinLinkResult } from "./repositories/interfaces/IJoinLinkRepository";
import MemberWorkspaceService from "../workspace/member-workspace/member.workspace.service";
import { BoardMember, WorkspaceMember } from "@prisma/client";

export default class JoinLinkService {
  constructor(private readonly joinLinkRepo: IJoinLinkRepository, private readonly memberWorkspaceService: MemberWorkspaceService) {}

  async checkToken(token: string): Promise<JoinLinkResult | null>{
    const validToken = await this.joinLinkRepo.checkToken(token);
    if(!validToken) {
      throw new InternalServerException("can not check validation of token");
    }
    return validToken
  }

  async join(token: string): Promise<WorkspaceMember | BoardMember | null>{
    const validToken = await this.checkToken(token);
    if (!validToken) {
      return null;
    }
    const { scope } = validToken;
    if(scope === "WORKSPACE") {
      return this.memberWorkspaceService.addMemberWorkspaceByLink(token);
    } else if (scope === "BOARD") {
      return this.memberBoardService.addMemberBoardByLink(token);
    } else {
      return null;
    }
  }
}