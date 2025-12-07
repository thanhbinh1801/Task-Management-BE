import { InternalServerException, NotFoundException } from "@/commons";
import { IWorkspaceRepository } from "./repository/interfaces/IWorkspaceRepository";
import { Workspace } from "@prisma/client";
import { WorkspaceCreateRequest, WorkspaceUpdateRequest } from './dtos/requests/workspace.request';
import { WorkspaceResponse } from './dtos/responses/workspace.response';
import { clearRbacWorkspaceCache } from "@/commons/utils/rbacCache";
import { redisService } from "@/modules/redis/redis.service";

const workspaceListKey = (userId: string) => `workspace:list:${userId}`;
const workspaceKey = (workspaceId: string) => `workspace:${workspaceId}`;
// const WORKSPACE_TTL_SECONDS = 300; 

export default class WorkspaceService {
  constructor(private readonly workspaceRepo: IWorkspaceRepository) {}

  async getWorkspaces(userId: string) : Promise<WorkspaceResponse[]> {
    const cacheKey = workspaceListKey(userId);
    try {
      const cached = await redisService.get<WorkspaceResponse[]>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('workspace list cache get error', err);
    }

    const workspaces = await this.workspaceRepo.findWorkspace(userId);
    if(workspaces.length === 0) {
      throw new NotFoundException('not found workspace');
    }
    try {
      await redisService.set(cacheKey, workspaces);
    } catch (err) {
      console.error('workspace list cache set error', err);
    }
    return workspaces;
  }

  async getWorkspaceById(workspaceId: string) : Promise<WorkspaceResponse | null> {
    const cacheKey = workspaceKey(workspaceId);
    try {
      const cached = await redisService.get<WorkspaceResponse>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('workspace cache get error', err);
    }

    const workspace = await this.workspaceRepo.findWorkspaceById(workspaceId);
    if(!workspace) {
      throw new NotFoundException('not found workspace');
    }
    try {
      await redisService.set(cacheKey, workspace);
    } catch (err) {
      console.error('workspace cache set error', err);
    }
    return workspace;
  }

  async createWorkspace(dataWorkspace: WorkspaceCreateRequest, userId: string ) : Promise<Workspace> {
    const newWorkspace = await this.workspaceRepo.createWorkspace(dataWorkspace, userId);
    if(!newWorkspace) {
      throw new InternalServerException('can not create workspace');
    }
    try {
      await redisService.del(workspaceListKey(userId));
    } catch (err) {
      console.error('workspace list cache clear error', err);
    }
    return newWorkspace;
  }

  async updateWorkspace(dataWorkspace: WorkspaceUpdateRequest, workspaceId: string) : Promise<Workspace> {
    const updateWorkspace = await this.workspaceRepo.updateWorkspace(dataWorkspace, workspaceId);
    if( !updateWorkspace) {
      throw new InternalServerException('can not update workspace');
    }
    try {
      await redisService.del(workspaceKey(workspaceId));
    } catch (err) {
      console.error('workspace cache clear error', err);
    }
    return updateWorkspace;
  }
  
  async deleteWorkspace(workspaceId: string, userId: string) : Promise<void> {
    const isDelete = await this.workspaceRepo.deleteWorkspace(workspaceId);
    if (!isDelete){
      throw new InternalServerException('can not delete workspace');
    }
    try {
      await redisService.del(workspaceKey(workspaceId));
      await redisService.del(workspaceListKey(userId));
    } catch (err) {
      console.error('workspace cache clear error', err);
    }
    await clearRbacWorkspaceCache(workspaceId, userId);
  }

  async hardDeleteWorkspace(workspaceId: string, userId: string): Promise<void> {
    const isDelete = await this.workspaceRepo.hardDeleteWorkspace(workspaceId);
    if (!isDelete) {
      throw new InternalServerException('can not hard delete workspace');
    }
    try {
      await redisService.del(workspaceKey(workspaceId));
      await redisService.del(workspaceListKey(userId));
    } catch (err) {
      console.error('workspace cache clear error', err);
    }
    await clearRbacWorkspaceCache(workspaceId, userId);
  }
}