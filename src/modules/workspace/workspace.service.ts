import { InternalServerException, NotFoundException } from "@/commons";
import { IWorkspaceRepository } from "./repository/interfaces/IWorkspaceRepository";
import { Workspace } from "@prisma/client";
import { WorkspaceCreateRequest, WorkspaceUpdateRequest } from './dtos/requests/workspace.request';
import { WorkspaceResponse } from './dtos/responses/workspace.response';
import { clearRbacWorkspaceCache } from "@/commons/utils/rbacCache";

export default class WorkspaceService {
  constructor(private readonly workspaceRepo: IWorkspaceRepository) {}

  async getWorkspaces(userId: string) : Promise<WorkspaceResponse[]> {
    const workspaces = await this.workspaceRepo.findWorkspace(userId);
    if(workspaces.length === 0) {
      throw new NotFoundException('not found workspace');
    }
    return workspaces;
  }

  async getWorkspaceById(workspaceId: string) : Promise<WorkspaceResponse | null> {
    const workspace = await this.workspaceRepo.findWorkspaceById(workspaceId);
    if(!workspace) {
      throw new NotFoundException('not found workspace');
    }
    return workspace;
  }

  async createWorkspace(dataWorkspace: WorkspaceCreateRequest, userId: string ) : Promise<Workspace> {
    const newWorkspace = await this.workspaceRepo.createWorkspace(dataWorkspace, userId);
    if(!newWorkspace) {
      throw new InternalServerException('can not create workspace');
    }
    return newWorkspace;
  }

  async updateWorkspace(dataWorkspace: WorkspaceUpdateRequest, workspaceId: string) : Promise<Workspace> {
    const updateWorkspace = await this.workspaceRepo.updateWorkspace(dataWorkspace, workspaceId);
    if( !updateWorkspace) {
      throw new InternalServerException('can not update workspace');
    }
    return updateWorkspace;
  }
  
  async deleteWorkspace(workspaceId: string, userId: string) : Promise<void> {
    const isDelete = await this.workspaceRepo.deleteWorkspace(workspaceId);
    if (!isDelete){
      throw new InternalServerException('can not delete workspace');
    }
    await clearRbacWorkspaceCache(workspaceId, userId);
  }

  async hardDeleteWorkspace(workspaceId: string, userId: string): Promise<void> {
    const isDelete = await this.workspaceRepo.hardDeleteWorkspace(workspaceId);
    if (!isDelete) {
      throw new InternalServerException('can not hard delete workspace');
    }
    await clearRbacWorkspaceCache(workspaceId, userId);
  }
}