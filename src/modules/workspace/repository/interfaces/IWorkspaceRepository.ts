import { Workspace } from '@prisma/client';
import { WorkspaceCreateRequest, WorkspaceUpdateRequest } from '../../dtos/requests/workspace.request';
import { WorkspaceResponse } from '../../dtos/responses/workspace.response';

export interface IWorkspaceRepository {
  findWorkspace(userId: string): Promise<WorkspaceResponse[]>;
  findWorkspaceById(workspaceId: string): Promise<WorkspaceResponse | null>;
  createWorkspace(workspaceData : WorkspaceCreateRequest, userId: string) : Promise<Workspace>;
  updateWorkspace(workspaceData: WorkspaceUpdateRequest, workspaceId: string) : Promise<Workspace>;
  deleteWorkspace(workspaceId: string) : Promise<Workspace>;
  hardDeleteWorkspace(workspaceId: string): Promise<Workspace>;
}