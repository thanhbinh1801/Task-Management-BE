import { IListRepository } from "../interfaces/IListRepository";
import { prisma } from "@/configs";
import { List, Prisma } from "@prisma/client";
import { ListCreateRequest, ListUpdateRequest } from "../../dtos/requests/list.request";
import { ConflictException, NotFoundException } from "@/commons";
import { ListResponse } from "../../dtos/responses/list.response"


export class ListPrismaRepository implements IListRepository {
  async findLists(): Promise<ListResponse[]> {
    const lists = await prisma.list.findMany({
      where: { deletedAt: null},
      orderBy: { position: 'asc' }, 
      include: {
        Card: { where: { deletedAt: null }}
      }
    });
    return lists.map( list => ({
      id: list.id,
      name: list.name,
      position: list.position.toNumber(),
      boardId: list.boardId,
      createAt: list.createdAt,
      updateAt: list.updatedAt,
      cards: list.Card.map( card => ({
        id: card.id,
        name: card.name,
        isComplete: card.isComplete,
        createAt: card.createdAt,
        updateAt: card.updatedAt
      }))
    })

    )
  }

  async findListById(listId: string): Promise<ListResponse | null> {
    const list = await prisma.list.findFirst({
      where: { id: listId, deletedAt: null },
      include: {
        Card: { where: { deletedAt: null } }
      }
    });

    if (!list) return null;

    return {
      id: list.id,
      name: list.name,
      position: list.position.toNumber(),
      boardId: list.boardId,
      createAt: list.createdAt,
      updateAt: list.updatedAt,
      cards: list.Card.map(card => ({
        id: card.id,
        name: card.name,
        isComplete: card.isComplete,
        createAt: card.createdAt,
        updateAt: card.updatedAt
      }))
    };
  }

  async createList(listData: ListCreateRequest, position: number): Promise<List> {
    return prisma.list.create({
      data: {
        name: listData.nameList,
        boardId: listData.boardId,
        position: new Prisma.Decimal(position),
      },
    });
  }

  async updateList(listData: ListUpdateRequest): Promise<List> {
    return prisma.list.update({
      where: { id: listData.listId },
      data: {
        ...( listData.nameList && { name: listData.nameList }),
        ...( listData.position && { position: new Prisma.Decimal(listData.position) }),
      },
    })
  }

  async deleteList(listId: string): Promise<List> {
    // Soft delete cascade: list -> cards
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: {
        Card: { where: { deletedAt: null } }
      }
    });

    if (!list) {
      throw new NotFoundException("List not found");
    }

    const now = new Date();

    // Soft delete all cards in this list
    const cardIds = list.Card.map(card => card.id);
    if (cardIds.length > 0) {
      await prisma.card.updateMany({
        where: { id: { in: cardIds } },
        data: { deletedAt: now }
      });
    }

    // Soft delete list
    return prisma.list.update({
      where: { id: listId },
      data: { deletedAt: now }
    });
  }

  async hardDeleteList(listId: string): Promise<List> {
    const list = await prisma.list.findUnique({
      where: { id: listId }
    });

    if (!list) {
      throw new NotFoundException("List not found");
    }

    if(!list.deletedAt) {
      throw new ConflictException("Cannot hard delete a list that is not soft deleted");
    }
    
    return prisma.list.delete({
      where: { id: listId }
    });
  }

  async findMaxPositionOfList(boardId: string): Promise<number> {
    const maxPositionList = await prisma.list.findFirst({
      where: { boardId: boardId, deletedAt: null },
      orderBy: { position: 'desc' },
    });
    return maxPositionList?.position.toNumber() ?? 0;
  }
}