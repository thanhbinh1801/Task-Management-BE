import { prisma } from "@/configs";
import { IMemberBoardRepository } from "../interfaces/IMemberBoardRepository";
import { BoardMember } from "@prisma/client";
import { ConflictException } from "@/commons/exceptions/conflict.exception";
import { NotFoundException } from "@/commons";

export default class MemberRepository implements IMemberBoardRepository {
  async addMemberBoard(email: string, boardId: string): Promise<BoardMember | null> {
    const board = await prisma.board.findUnique({
      where: { id: boardId }
    });

    if (!board) {
      throw new NotFoundException('Board does not exist');
    };

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingMember = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId: user.id, boardId }
      }
    });
    if (existingMember) {
      throw new ConflictException('User is already a member of the board');
    }

    return prisma.boardMember.create({
      data: {
        user: { connect: { id: user.id } },
        board: { connect: { id: boardId } },
        role: { connect: { roleName: 'MemberBoard' } }
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
}
