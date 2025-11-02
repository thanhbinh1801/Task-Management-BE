import { List } from "@prisma/client";
import { ListCreateRequest, ListUpdateRequest } from "../../dtos/requests/list.request";

export  interface IListRepository {
  findLists(boardId: string): Promise<List[]>;
  findListById(listId: string): Promise<List | null>;
  createList(listData: ListCreateRequest, boardId: string): Promise<List>;
  updateList(listData: ListUpdateRequest): Promise<List>;
  deleteList(listId: string): Promise<List>;
}