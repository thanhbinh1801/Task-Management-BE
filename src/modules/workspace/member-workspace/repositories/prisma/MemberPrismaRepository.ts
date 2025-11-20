import { prisma } from "@/configs";
import { IMemberWorkspaceRepository } from "../interfaces/IMemberRepository";
import { WorkspaceMember } from "@prisma/client";
import { NotFoundException } from "@/commons/exceptions/notFound.exception";
import { BadRequestException, ConflictException } from "@/commons";

export default class MemberWorkspaceRepository implements IMemberWorkspaceRepository {
  async addMemberWorkspace(email: string, workspaceId: string): Promise<WorkspaceMember | null> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId }
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const userId = await prisma.user.findUnique({
      where: { email }
    });

    if (!userId) return null;

    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId: userId.id, workspaceId }
      }
    });
    if (existingMember) {
      throw new ConflictException('User is already a member of the workspace');
    }

    const role = await prisma.role.findFirst({
      where: { roleName: 'MemberWorkspace' }
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    return prisma.workspaceMember.create({
      data: {
        userId: userId.id,
        workspaceId: workspaceId,
        roleId: role?.id || ''
      }
    });
  } 

  async getMember(workspaceId: string): Promise<WorkspaceMember[] | null> {
    return prisma.workspaceMember.findMany({
      where: { workspaceId }
    });
  }

  async updateMember(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember | null> {
    const roleRecord = await prisma.role.findFirst({
      where: { roleName: role }
    });

    if (!roleRecord) return null;

    return prisma.workspaceMember.update({
      where: { userId_workspaceId: { userId, workspaceId } },
      data: {
        roleId: roleRecord?.id || ''
      }
    });
  }

  async removeMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null> {
    return prisma.workspaceMember.delete({
      where: { userId_workspaceId: { userId, workspaceId } }
    });
  }
}
