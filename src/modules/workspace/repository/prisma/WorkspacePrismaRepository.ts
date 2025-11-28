import { Workspace } from "@prisma/client";
import { IWorkspaceRepository } from "../interfaces/IWorkspaceRepository";
import { prisma } from "@/configs";
import { WorkspaceCreateRequest, WorkspaceUpdateRequest } from '../../dtos/requests/workspace.request';
import { ConflictException, NotFoundException } from "@/commons";
import { WorkspaceResponse } from '../../dtos/responses/workspace.response';

export class WorkspacePrismaRepository implements IWorkspaceRepository {
  async findWorkspace(userId: string): Promise<WorkspaceResponse[]> {
    const workspaces = await prisma.workspace.findMany({
      where: { 
        deletedAt: null,
        members: {
          some: { userId: userId }
        }
      },
      include: {
        members: {
          include: {
            role: { select: { roleName: true } },
            user: { select: { name: true, email: true, avatarUrl: true } }
          }
        },
        boards: { where: { deletedAt: null } }
      }
    });

    return workspaces.map(ws => ({
      id: ws.id,
      name: ws.name,
      visibility: ws.visibility,
      createdAt: ws.createdAt,
      updatedAt: ws.updatedAt,
      members: ws.members.map(m => ({
        userId: m.userId,
        userName: m.user.name || 'Unknown',
        userEmail: m.user.email,
        workspaceId: m.workspaceId,
        roleId: m.roleId,
        roleName: m.role.roleName,
        avatarUrl: m.user.avatarUrl ?? undefined,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt
      })),
      boards: ws.boards.map(board => ({
        id: board.id,
        name: board.name,
        workspaceId: board.workspaceId,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt
      }))
    }));
  }

  async findWorkspaceById(workspaceId: string) : Promise<WorkspaceResponse | null> {
    const workspace = await prisma.workspace.findUnique({ 
      where: { id: workspaceId },
      include: {
        members: {
          include: {
            role: { select: { roleName: true } },
            user: { select: { name: true, email: true, avatarUrl: true } }
          }
        },
        boards: { where: { deletedAt: null } }
      }
    });

    if (!workspace) return null;

    return {
      id: workspace.id,
      name: workspace.name,
      visibility: workspace.visibility,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      members: workspace.members.map(m => ({
        userId: m.userId,
        userName: m.user.name || 'Unknown',
        userEmail: m.user.email,
        workspaceId: m.workspaceId,
        roleId: m.roleId,
        roleName: m.role.roleName,
        avatarUrl: m.user.avatarUrl ?? undefined,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt
      })),
      boards: workspace.boards
    };
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
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        boards: {
          include: {
            List: {
              include: {
                Card: true
              }
            }
          }
        },
        members: true,
        joinLinks: true
      }
    });

    if ( !workspace ) {
      throw new NotFoundException("Workspace not found");
    }

    const now = new Date();

    // Soft delete all cards in this workspace
    const cardIds = workspace.boards.flatMap( board => board.List.flatMap( list => list.Card.map( card => card.id )));
    if( cardIds.length > 0) {
      await prisma.card.updateMany({
        where: { id: { in: cardIds } },
        data: { deletedAt: now }
      })
    }

    const listIds = workspace.boards.flatMap( board => board.List.map( list => list.id ));
    if( listIds.length > 0) {
      await prisma.list.updateMany({
        where: { id: { in: listIds } },
        data: { deletedAt: now }
      })
    }

    const boardIds = workspace.boards.map( board => board.id );
    if( boardIds.length > 0) {
      await prisma.board.updateMany({
        where: { id: { in: boardIds } },
        data: { deletedAt: now }
      })
    }

    // Delete BoardMembers for all boards in this workspace
    if (boardIds.length > 0) {
      await prisma.boardMember.deleteMany({
        where: { boardId: { in: boardIds } }
      });
    }

    // Delete WorkspaceMembers
    await prisma.workspaceMember.deleteMany({
      where: { workspaceId: workspaceId }
    });

    // Delete WorkspaceJoinLinks
    await prisma.workspaceJoinLink.deleteMany({
      where: { workspaceId: workspaceId }
    });

    // Delete BoardJoinLinks for all boards in this workspace
    if (boardIds.length > 0) {
      await prisma.boardJoinLink.deleteMany({
        where: { boardId: { in: boardIds } }
      });
    }

    return prisma.workspace.update({
      where: { id: workspaceId },
      data: { deletedAt: now }
    });
  }

  async hardDeleteWorkspace(workspaceId: string): Promise<Workspace> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId }
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    if(!workspace.deletedAt) {
      throw new ConflictException("Cannot hard delete a workspace that is not soft deleted");
    }

    return prisma.workspace.delete({
      where: { id: workspaceId }
    });
  }
}