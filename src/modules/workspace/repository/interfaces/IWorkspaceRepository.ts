import { Workspace } from "@prisma/client";
import { WorkspaceCreateRequest, WorkspaceUpdateRequest } from '../../dtos/requests/workspace.request';

export interface IWorkspaceRepository {
  findWorkspace(): Promise<Workspace[] >;
  findWorkspaceById(workspaceId: string): Promise<Workspace | null>;
  createWorkspace(workspaceData : WorkspaceCreateRequest, userId: string) : Promise<Workspace>;
  updateWorkspace(workspaceData: WorkspaceUpdateRequest, workspaceId: string) : Promise<Workspace>;
  deleteWorkspace(workspaceId: string) : Promise<Workspace>;
}