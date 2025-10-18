import { IBoardRepository } from "../interfaces/IBoardRepository";
import { prisma } from "@/configs";
import { Board } from "@prisma/client";
import { BoardCreateRequest, BoardUpdateRequest } from "../../dtos/requests/board.request";
import { NotFoundException } from "@/commons";


export class BoardPrismaRepository implements IBoardRepository {
  async findBoards(workspaceId: string): Promise<Board[]> {
    return prisma.board.findMany({
      where: {workspaceId: workspaceId, deletedAt: null}
    });
  }

  async findBoardById(boardId: string): Promise<Board | null> {
    return prisma.board.findFirst({
      where: { id: boardId}
    });
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
        title: boardData.nameBoard,
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
        ...( boardData.nameBoard && { title: boardData.nameBoard }),
      },
    });
  }

  async deleteBoard(boardId: string): Promise<Board> {
    return prisma.board.update({
      where: { id: boardId},
      data: {
        deletedAt: new Date(),
      }
    }
    )
  }
}