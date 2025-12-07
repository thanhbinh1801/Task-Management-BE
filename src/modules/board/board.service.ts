import { InternalServerException, NotFoundException } from "@/commons";
import { IBoardRepository } from "./repository/interfaces/IBoardRepository";
import { ITemplateRepository } from "@/modules/board-template/interfaces/ITemplateRepository";
import { Board } from "@prisma/client";
import { BoardCreateRequest, BoardUpdateRequest } from "./dtos/requests/board.request";

export class BoardService {
  constructor(
    private readonly boardRepo: IBoardRepository,
    private readonly templateRepo: ITemplateRepository  
  ) {}

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

  async createBoard(
    boardData: BoardCreateRequest,
    workspaceId: string, 
    userId: string
  ): Promise<Board> {
    
    if (boardData.templateId) {
      const newBoard = await this.templateRepo.cloneTemplateToBoard(
        boardData.templateId,
        boardData.nameBoard,
        workspaceId,
        userId
      );
      
      if (!newBoard) {
        throw new InternalServerException("Cannot create board from template");
      }
      
      return newBoard;
    }
    
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

  async hardDeleteBoard(boardId: string): Promise<void> {
    const isDelete = await this.boardRepo.hardDeleteBoard(boardId);
    if (!isDelete) {
      throw new InternalServerException('can not hard delete board');
    }
  }
}