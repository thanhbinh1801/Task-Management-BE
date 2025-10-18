import { Board } from "@prisma/client";
import { BoardCreateRequest, BoardUpdateRequest } from "../../dtos/requests/board.request";

export  interface IBoardRepository {
  findBoards(workspaceId: string): Promise<Board[]>;
  findBoardById(boardId: string): Promise<Board | null>;
  createBoard(boardData: BoardCreateRequest,workspaceId: string, userId: string): Promise<Board>;
  updateBoard(boardData: BoardUpdateRequest) : Promise<Board>;
  deleteBoard(boardId: string): Promise<Board>;
}