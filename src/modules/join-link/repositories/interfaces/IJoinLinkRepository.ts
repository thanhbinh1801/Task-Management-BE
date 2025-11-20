import { WorkspaceJoinLink, BoardJoinLink } from "@prisma/client";
export type JoinLinkScope = "WORKSPACE" | "BOARD";

export interface JoinLinkResult {
  scope: JoinLinkScope,
  link: WorkspaceJoinLink | BoardJoinLink;
  id: string
}

export default interface IJoinLinkRepository {
  checkToken(token: string): Promise<JoinLinkResult | null>;
  // join(token: string, scope: JoinLinkScope) : Promise<boolean>;
}
