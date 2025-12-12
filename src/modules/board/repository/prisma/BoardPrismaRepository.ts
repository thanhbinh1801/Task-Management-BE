import { IBoardRepository } from "../interfaces/IBoardRepository";
import { prisma } from "@/configs";
import { Board } from "@prisma/client";
import { BoardCreateRequest, BoardUpdateRequest } from "../../dtos/requests/board.request";
import { ConflictException, NotFoundException } from "@/commons";
import { BoardResponse } from "../../dtos/responses/board.response";


export class BoardPrismaRepository implements IBoardRepository {
  async findBoards(workspaceId: string): Promise<BoardResponse[]> {
    const boards = await prisma.board.findMany({
      where: {workspaceId: workspaceId, deletedAt: null, isTemplate: false},
      include: {
        members: {
          include: {
            role: { select: { roleName: true } },
            user: { select: { name: true, email: true, avatarUrl: true } }
          }
        },
        List: {
          where: { deletedAt: null },
          include: {
            Card: { where: { deletedAt: null } }
          }
        }
      }
    });
    return boards.map( board => ({
      id: board.id,
      name: board.name,
      workspaceId: board.workspaceId,
      members: board.members.map(m => ({
        userId: m.userId,
        userName: m.user.name || 'Unknown',
        userEmail: m.user.email,
        boardId: m.boardId,
        roleId: m.roleId,
        roleName: m.role.roleName,
        avatarUrl: m.user.avatarUrl ?? undefined,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt
      })),
      lists: board.List.map(list => ({
        id: list.id,
        name: list.name,
        boardId: list.boardId,
        position: list.position.toNumber(),
        cards: list.Card.map(card => ({
          id: card.id,
          name: card.name,
          isComplete: card.isComplete
        }))
      }))
    }));
  }

  async findBoardById(boardId: string): Promise<BoardResponse | null> {
    const board = await prisma.board.findUnique({
      where: { id: boardId, isTemplate: false },
      include: {
        members: {
          include: {
            role: { select: { roleName: true } },
            user: { select: { name: true, email: true, avatarUrl: true } }
          }
        },
        List: {
          where: { deletedAt: null },
          include: {
            Card: { where: { deletedAt: null } }
          }
        }
      }
    });
    if (!board) return null;
    return {
      id: board.id,
      name: board.name,
      workspaceId: board.workspaceId,
      members: board.members.map(m => ({
        userId: m.userId,
        userName: m.user.name || 'Unknown',
        userEmail: m.user.email,
        boardId: m.boardId,
        roleId: m.roleId,
        roleName: m.role.roleName,
        avatarUrl: m.user.avatarUrl ?? undefined,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt
      })),
      lists: board.List.map(list => ({
        id: list.id,
        name: list.name,
        boardId: list.boardId,
        position: list.position.toNumber(),
        cards: list.Card.map(card => ({
          id: card.id,
          name: card.name,
          isComplete: card.isComplete
        }))
      }))
    }
  }

  async createBoard(boardData: BoardCreateRequest, workspaceId: string, userId: string): Promise<Board>{ 
    const isWorkspaceExisted = await prisma.workspace.findFirst({
      where: { id: workspaceId, deletedAt: null}
    })
    if(!isWorkspaceExisted) {
      throw new NotFoundException("Workspace not found or has been deleted");
    }
    return prisma.board.create({
      data: {
        name: boardData.nameBoard,
        workspaceId: workspaceId,
        members: {
          create: {
            user: { connect: {id: userId}},
            role: { connect: { roleName: "OwnerBoard"}}
          },
        },
      },
    });
  }

  async updateBoard(boardData: BoardUpdateRequest) : Promise<Board> {
    return prisma.board.update({
      where: { id: boardData.boardId },
      data: {
        ...( boardData.nameBoard && { name: boardData.nameBoard }),
      },
    });
  }

  async deleteBoard(boardId: string): Promise<Board> {
    // Soft delete cascade: board -> lists -> cards, and delete board members
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        List: {
          where: { deletedAt: null },
          include: {
            Card: { where: { deletedAt: null } }
          }
        }
      }
    });

    if (!board) {
      throw new NotFoundException("Board not found");
    }

    const now = new Date();

    // Soft delete all cards in all lists
    const cardIds = board.List.flatMap(list => list.Card.map(card => card.id));
    if (cardIds.length > 0) {
      await prisma.card.updateMany({
        where: { id: { in: cardIds } },
        data: { deletedAt: now }
      });
    }

    // Soft delete all lists
    const listIds = board.List.map(list => list.id);
    if (listIds.length > 0) {
      await prisma.list.updateMany({
        where: { id: { in: listIds } },
        data: { deletedAt: now }
      });
    }

    // Delete all board members
    await prisma.boardMember.deleteMany({
      where: { boardId: boardId }
    });

    // Delete all board members 
    await prisma.boardMember.deleteMany({
      where: { boardId: boardId }
    });

    // Delete all board join links
    await prisma.boardJoinLink.deleteMany({
      where: { boardId: boardId }
    });

    // Soft delete board
    return prisma.board.update({
      where: { id: boardId },
      data: { deletedAt: now }
    });
  }

  async hardDeleteBoard(boardId: string): Promise<Board> {
    const board = await prisma.board.findUnique({
      where: { id: boardId }
    });

    if (!board) {
      throw new NotFoundException("Board not found");
    }

    if(!board.deletedAt) {
      throw new ConflictException("Cannot hard delete a board that is not soft deleted");
    }

    return prisma.board.delete({
      where: { id: boardId }
    });
  }
}