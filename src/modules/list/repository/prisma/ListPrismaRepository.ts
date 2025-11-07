import { IListRepository } from "../interfaces/IListRepository";
import { prisma } from "@/configs";
import { List, Prisma } from "@prisma/client";
import { ListCreateRequest, ListUpdateRequest } from "../../dtos/requests/list.request";
import { ConflictException, NotFoundException } from "@/commons";


export class ListPrismaRepository implements IListRepository {
  async findLists(boardId: string): Promise<List[]> {
    return prisma.list.findMany({
      where: { boardId: boardId, deletedAt: null }
    });
  }

  async findListById(listId: string): Promise<List | null> {
    return prisma.list.findFirst({
      where: { id: listId, deletedAt: null }
    });
  }

  async createList(listData: ListCreateRequest, boardId: string): Promise<List> {
    const isBoardExisted = await prisma.board.findFirst({
      where: { id: boardId, deletedAt: null }
    })
    if (!isBoardExisted) {
      throw new NotFoundException("Board not found or has been deleted");
    }
    const lastIndex = await prisma.list.findFirst({
      where: { boardId: boardId, deletedAt: null },
      orderBy: { position: 'desc' }
    });
    const STEP = new Prisma.Decimal(1000);
    return prisma.list.create({
      data: {
        name: listData.nameList,
        boardId: boardId,
        position: lastIndex ? lastIndex.position.plus(STEP) : STEP,
      },
    });
  }

  async updateList(listData: ListUpdateRequest): Promise<List> {
    const STEP = new Prisma.Decimal(1000);
    const EPS = new Prisma.Decimal(0.000001);
    let [left, right] = await Promise.all([
      listData.leftId ? prisma.list.findFirst({
        where: {
          id: listData.leftId, deletedAt: null
        }
      }) : null,
      listData.rightId ? prisma.list.findFirst({
        where: {
          id: listData.rightId, deletedAt: null
        }
      }) : null,
    ])
    let newPos;
    if (left && right) {
      if (right.position.minus(left.position).lt(EPS)) {
        //reindex needed
        const lists = await prisma.list.findMany({
          where: { boardId: left.boardId, deletedAt: null },
          orderBy: { position: 'asc' }
        });
        if (lists.length === 0) {
          throw new NotFoundException("No lists found for reindexing");
        }
        for (let i = 0; i < lists.length; i++) {
          lists[i] = await prisma.list.update({
            where: { id: lists[i].id },
            data: { position: new Prisma.Decimal(i * STEP.toNumber()) }
          });
        }

        const [newLeft, newRight] = await Promise.all([
          listData.leftId ? prisma.list.findFirst({
            where: {
              id: listData.leftId, deletedAt: null
            }
          }) : null,
          listData.rightId ? prisma.list.findFirst({
            where: {
              id: listData.rightId, deletedAt: null
            }
          }) : null,
        ]);

        left = newLeft;
        right = newRight;
      }
      if (!left || !right) {
        throw new NotFoundException("Left or right list not found after reindexing");
      }
      newPos = left.position.plus(right.position).div(2);
    } else if (left && !right) {
      newPos = left.position.plus(STEP);
    } else if (!left && right) {
      newPos = right.position.minus(STEP);
    } else {
      newPos = STEP;
    }

    return prisma.list.update({
      where: { id: listData.listId },
      data: {
        ...(listData.nameList && { name: listData.nameList }),
        position: newPos,
      },
    });
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
}