import { IListRepository } from "../interfaces/IListRepository";
import { prisma } from "@/configs";
import { List } from "@prisma/client";
import { ListCreateRequest, ListUpdateRequest } from "../../dtos/requests/list.request";
import { NotFoundException } from "@/commons";


export class ListPrismaRepository implements IListRepository {
  async findLists(boardId: string): Promise<List[]> {
    return prisma.list.findMany({
      where: {boardId: boardId, deletedAt: null}
    });
  }

  async findListById(listId: string): Promise<List | null> {
    return prisma.list.findFirst({
      where: { id: listId, deletedAt: null }
    });
  }

  async createList(listData: ListCreateRequest, boardId: string): Promise<List>{ 
    const isBoardExisted = await prisma.board.findFirst({
      where: { id: boardId, deletedAt: null }
    })
    if(!isBoardExisted) {
      throw new NotFoundException("Board not found or has been deleted");
    }
    return prisma.list.create({
      data: {
        name: listData.nameList,
        boardId: boardId,
      },
    });
  }

  async updateList(listData: ListUpdateRequest): Promise<List> {
    return prisma.list.update({
      where: { id: listData.listId },
      data: {
        ...( listData.nameList && { name: listData.nameList }),
      },
    });
  }

  async deleteList(listId: string): Promise<List> {
    return prisma.list.update({
      where: { id: listId },
      data: {
        deletedAt: new Date(),
      }
    }
    )
  }
}