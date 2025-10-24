import { prisma } from "@/configs";
import { IMemberWorkspaceRepository } from "../interfaces/IMemberRepository";
import { WorkspaceMember } from "@prisma/client";

export default class MemberWorkspaceRepository implements IMemberWorkspaceRepository {
  async addMemberWorkspace(email: string, workspaceId: string): Promise<WorkspaceMember | null> {
    const userId = await prisma.user.findUnique({
      where: { email }
    });

    if (!userId) return null;

    const role = await prisma.role.findFirst({
      where: { roleName: 'MEMBER' }
    });

    if (!role) return null;

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

  async getEmailAndWorkspaceIdByLink(token: string): Promise<{ email: string | null; workspaceId: string | null }> {
    const joinLink = await prisma.workspaceJoinLink.findUnique({
      where: { token }
    });
    const user = await prisma.user.findUnique({
      where: { id: joinLink?.createdById }
    });
    return {
      email: user?.email || null,
      workspaceId: joinLink?.workspaceId || null
    };
  }
}
