import { prisma } from "@/configs";
import { IMemberBoardRepository } from "../interfaces/IMemberBoardRepository";
import { BoardMember } from "@prisma/client";

export default class MemberRepository implements IMemberBoardRepository {
  async addMemberBoard(email: string, boardId: string): Promise<BoardMember | null> {
    const userId = await prisma.user.findUnique({
      where: { email }
    });

    if (!userId) return null;

    const role = await prisma.role.findFirst({
      where: { roleName: 'MEMBER' }
    });

    if (!role) return null;

    return prisma.boardMember.create({
      data: {
        userId: userId.id,
        boardId: boardId,
        roleId: role?.id || ''
      }
    });
  } 

  async getMember(boardId: string): Promise<BoardMember[] | null> {
    return prisma.boardMember.findMany({
      where: { boardId }
    });
  }

  async updateMember(boardId: string, userId: string, role: string): Promise<BoardMember | null> {
    const roleRecord = await prisma.role.findFirst({
      where: { roleName: role }
    });

    if (!roleRecord) return null;

    return prisma.boardMember.update({
      where: { userId_boardId: { userId, boardId } },
      data: {
        roleId: roleRecord?.id || ''
      }
    });
  }

  async removeMember(boardId: string, userId: string): Promise<BoardMember | null> {
    return prisma.boardMember.delete({
      where: { userId_boardId: { userId, boardId } }
    });
  }

  async getEmailAndBoardIdByLink(token: string): Promise<{ email: string | null; boardId: string | null }> {
    const joinLink = await prisma.boardJoinLink.findUnique({
      where: { token }
    });
    const user = await prisma.user.findUnique({
      where: { id: joinLink?.createdById }
    });
    return {
      email: user?.email || null,
      boardId: joinLink?.boardId || null
    };
  }
}
