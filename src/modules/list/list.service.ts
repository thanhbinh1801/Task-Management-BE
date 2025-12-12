import { InternalServerException, NotFoundException } from "@/commons";
import { IListRepository } from "./repository/interfaces/IListRepository";
import { List } from "@prisma/client";
import { ListCreateRequest, ListUpdateRequest } from "./dtos/requests/list.request";
import { ListResponse } from "./dtos/responses/list.response";
import { redisService } from "@/modules/redis/redis.service";

const listPerBoardKey = (boardId: string) => `list:board:${boardId}`;
const listKey = (listId: string) => `list:${listId}`;
// const LIST_TTL_SECONDS = 300; // 5 minutes

export class ListService {
  constructor( private readonly listRepo: IListRepository){}

  async getLists(boardId: string): Promise<ListResponse[]> {
    const cacheKey = listPerBoardKey(boardId);
    try {
      const cached = await redisService.get<ListResponse[]>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('list cache get error', err);
    }

    const lists = await this.listRepo.findLists(boardId);
    if(lists.length === 0) {
      throw new NotFoundException("Lists not found");
    }

    try {
      await redisService.set(cacheKey, lists);
    } catch (err) {
      console.error('list cache set error', err);
    }
    return lists;
  } 

  async getListById(listId: string): Promise<ListResponse | null> {
    const cacheKey = listKey(listId);
    try {
      const cached = await redisService.get<ListResponse>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('list detail cache get error', err);
    }

    const list = await this.listRepo.findListById(listId);
    if(!list) {
      throw new NotFoundException("List not found");
    }

    try {
      await redisService.set(cacheKey, list);
    } catch (err) {
      console.error('list detail cache set error', err);
    }
    return list;
  }

  async createList(listData: ListCreateRequest, boardId: string): Promise<List> {
    const newList = await this.listRepo.createList(listData, boardId);
    if(!newList) {
      throw new InternalServerException("can not create list");
    }
    try {
      await redisService.del(listPerBoardKey(boardId));
    } catch (err) {
      console.error('list cache clear error', err);
    }
    return newList;
  }

  async updateList(listData: ListUpdateRequest): Promise<List> {
    const updateList = await this.listRepo.updateList(listData);
    if(!updateList) {
      throw new InternalServerException("can not update list");
    }
    try {
      await redisService.del(listKey(updateList.id));
    } catch (err) {
      console.error('list cache clear error', err);
    }
    return updateList;
  }

  async deleteList(listId: string): Promise<void> {
    const isDelete = await this.listRepo.deleteList(listId);
    if(!isDelete) {
      throw new InternalServerException('can not delete list');
    }
    try {
      await redisService.del(listKey(listId));
    } catch (err) {
      console.error('list cache clear error', err);
    }
  }

  async hardDeleteList(listId: string): Promise<void> {
    const isDelete = await this.listRepo.hardDeleteList(listId);
    if (!isDelete) {
      throw new InternalServerException('can not hard delete list');
    }
    try {
      await redisService.del(listKey(listId));
    } catch (err) {
      console.error('list cache clear error', err);
    }
  }
}