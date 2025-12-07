import { InternalServerException, NotFoundException } from "@/commons";
import { IListRepository } from "./repository/interfaces/IListRepository";
import { List } from "@prisma/client";
import { ListCreateRequest, ListUpdateRequest } from "./dtos/requests/list.request";
import { ListResponse } from "./dtos/responses/list.response";

export class ListService {
  constructor( private readonly listRepo: IListRepository){}

  async getLists(boardId: string): Promise<ListResponse[]> {
    const lists = await this.listRepo.findLists(boardId);
    if(lists.length === 0) {
      throw new NotFoundException("Lists not found");
    }
    return lists;
  } 

  async getListById(listId: string): Promise<ListResponse | null> {
    const list = await this.listRepo.findListById(listId);
    if(!list) {
      throw new NotFoundException("List not found");
    }
    return list;
  }

  async createList(listData: ListCreateRequest, boardId: string): Promise<List> {
    const newList = await this.listRepo.createList(listData, boardId);
    if(!newList) {
      throw new InternalServerException("can not create list");
    }
    return newList;
  }

  async updateList(listData: ListUpdateRequest): Promise<List> {
    const updateList = await this.listRepo.updateList(listData);
    if(!updateList) {
      throw new InternalServerException("can not update list");
    }
    return updateList;
  }

  async deleteList(listId: string): Promise<void> {
    const isDelete = await this.listRepo.deleteList(listId);
    if(!isDelete) {
      throw new InternalServerException('can not delete list');
    }
  }

  async hardDeleteList(listId: string): Promise<void> {
    const isDelete = await this.listRepo.hardDeleteList(listId);
    if (!isDelete) {
      throw new InternalServerException('can not hard delete list');
    }
  }
}