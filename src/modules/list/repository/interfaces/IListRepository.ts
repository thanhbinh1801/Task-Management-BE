import { List } from "@prisma/client";
import { ListCreateRequest, ListUpdateRequest } from "../../dtos/requests/list.request";
import { ListResponse } from "../../dtos/responses/list.response";
export  interface IListRepository {
  findLists(boardId: string): Promise<ListResponse[]>;
  findListById(listId: string): Promise<ListResponse | null>;
  createList(listData: ListCreateRequest, boardId: string, position: number): Promise<List>;
  updateList(listData: ListUpdateRequest): Promise<List>;
  deleteList(listId: string): Promise<List>;
  hardDeleteList(listId: string): Promise<List>;
  findMaxPositionOfList(boardId: string): Promise<number>;
}