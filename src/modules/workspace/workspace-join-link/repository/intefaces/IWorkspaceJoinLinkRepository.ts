import { WorkspaceJoinLink } from "@prisma/client";

export interface IWorkspaceJoinLinkRepository {
  createLink(token: string, workspaceId: string, userId: string): Promise<WorkspaceJoinLink>;
  revokeLink(token: string): Promise<WorkspaceJoinLink>;
}