import { WorkspaceMember } from "@prisma/client";

export interface IMemberWorkspaceRepository {
  addMemberWorkspace(email: string, workspaceId: string): Promise<WorkspaceMember | null>;
  getMember(workspaceId: string): Promise<WorkspaceMember[] | null>;
  updateMember(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember | null>;
  removeMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null>;
  getEmailAndWorkspaceIdByLink(token: string): Promise<{ email: string | null; workspaceId: string | null }>;
}