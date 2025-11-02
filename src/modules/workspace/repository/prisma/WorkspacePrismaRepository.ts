import { Workspace } from "@prisma/client";
import { IWorkspaceRepository } from "../interfaces/IWorkspaceRepository";
import { prisma } from "@/configs";
import { WorkspaceCreateRequest, WorkspaceUpdateRequest } from '../../dtos/requests/workspace.request';

export class WorkspacePrismaRepository implements IWorkspaceRepository {
  async findWorkspace(userId: string): Promise<Workspace[]> {
    return prisma.workspace.findMany({
      where: { 
        deletedAt: null,
        members: {
          some: { userId: userId}
        }
      }
    });
  }

  async findWorkspaceById(workspaceId: string) : Promise<Workspace | null> {
    return prisma.workspace.findUnique({
      where: { id: workspaceId}
    });
  }

  async createWorkspace(workspaceData : WorkspaceCreateRequest, userId: string) : Promise<Workspace> {
    return prisma.workspace.create({
      data: {
        name: workspaceData.name,
        visibility: workspaceData.visibility,
        members: {
          create:{
            user: {connect: { id: userId}},
            role: { connect: { roleName: "OwnerWorkspace"} ,}
          },
        },
      }
    });
  }

  async updateWorkspace(workspaceData: WorkspaceUpdateRequest, workspaceId: string) : Promise<Workspace> {
    return prisma.workspace.update({
      where: {id: workspaceId },
      data: {
        ...( workspaceData.name && { name: workspaceData.name}),
        ...( workspaceData.visibility && { visibility: workspaceData.visibility})
      }
    });
  }

  async  deleteWorkspace(workspaceId: string) : Promise<Workspace> {
    return prisma.workspace.update({
      where: { id: workspaceId},
      data: {
        deletedAt: new Date(),
      }
    })
  }
}