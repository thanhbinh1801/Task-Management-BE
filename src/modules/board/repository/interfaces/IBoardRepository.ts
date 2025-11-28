import { Board } from "@prisma/client";
import { BoardCreateRequest, BoardUpdateRequest } from "../../dtos/requests/board.request";
import { BoardResponse } from "../../dtos/responses/board.response";

export  interface IBoardRepository {
  findBoards(workspaceId: string): Promise<BoardResponse[]>;
  findBoardById(boardId: string): Promise<BoardResponse | null>;
  createBoard(boardData: BoardCreateRequest,workspaceId: string, userId: string): Promise<Board>;
  updateBoard(boardData: BoardUpdateRequest) : Promise<Board>;
  deleteBoard(boardId: string): Promise<Board>;
  hardDeleteBoard(boardId: string): Promise<Board>;
}