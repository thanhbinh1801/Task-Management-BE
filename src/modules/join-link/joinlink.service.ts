import { InternalServerException } from "@/commons";
import IJoinLinkRepository from "./repositories/interfaces/IJoinLinkRepository";
import { JoinLinkResult } from "./repositories/interfaces/IJoinLinkRepository";
import MemberWorkspaceService from "../workspace/member-workspace/member.workspace.service";
import MemberBoardService from "../board/member-board/member.board.service";
import { BoardMember, WorkspaceMember } from "@prisma/client";

export default class JoinLinkService {
  constructor(private readonly joinLinkRepo: IJoinLinkRepository,
    private readonly memberWorkspaceService: MemberWorkspaceService,
    private readonly memberBoardService: MemberBoardService) {}

  async checkToken(token: string): Promise<JoinLinkResult | null>{
    const validToken = await this.joinLinkRepo.checkToken(token);
    if(!validToken) {
      throw new InternalServerException("can not check validation of token");
    }
    return validToken
  }

  async join(token: string, email: string): Promise<WorkspaceMember | BoardMember | null>{
    const validToken = await this.checkToken(token);
    if (!validToken) {
      return null;
    }
    const { scope, id } = validToken;
    if(scope === "WORKSPACE") {
      return this.memberWorkspaceService.addMemberWorkspaceByEmail(email, id);
    } else if (scope === "BOARD") {
      return this.memberBoardService.addMemberBoardByEmail(email, id);
    } else {
      return null;
    }
  }
}