import { InternalServerException, NotFoundException } from "@/commons";
import { IBoardRepository } from "./repository/interfaces/IBoardRepository";
import { Board } from "@prisma/client";
import { BoardCreateRequest, BoardUpdateRequest } from "./dtos/requests/board.request";

export class BoardService {
  constructor( private readonly boardRepo: IBoardRepository){}

  async getBoards(workspaceId: string): Promise<Board[]> {
    const boards = await this.boardRepo.findBoards(workspaceId);
    if(boards.length === 0) {
      throw new NotFoundException("Boards not found");
    }
    return boards;
  } 

  async getBoardById(boardId: string): Promise<Board | null> {
    const board = await this.boardRepo.findBoardById(boardId);
    if(!board) {
      throw new NotFoundException("Board not found");
    }
    return board;
  }

  async createBoard(boardData: BoardCreateRequest,workspaceId: string, userId: string): Promise<Board> {
    const newBoard = await this.boardRepo.createBoard(boardData, workspaceId, userId);
    if(!newBoard) {
      throw new InternalServerException("can not create board");
    }
    return newBoard;
  }

  async updateBoard(boardData: BoardUpdateRequest): Promise<Board> {
    const updateBoard = await this.boardRepo.updateBoard(boardData);
    if(!updateBoard) {
      throw new InternalServerException("can not update board");
    }
    return updateBoard;
  }

  async deleteBoard(boarId: string): Promise<void> {
    const isDelete = await this.boardRepo.deleteBoard(boarId);
    if(!isDelete) {
      throw new InternalServerException('can not delete board');
    }
  }
}