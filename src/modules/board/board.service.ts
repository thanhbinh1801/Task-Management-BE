import { InternalServerException, NotFoundException } from "@/commons";
import { IBoardRepository } from "./repository/interfaces/IBoardRepository";
import { ITemplateRepository } from "@/modules/board-template/interfaces/ITemplateRepository";
import { Board } from "@prisma/client";
import { BoardCreateRequest, BoardUpdateRequest } from "./dtos/requests/board.request";
import { BoardResponse } from "./dtos/responses/board.response";
import { clearRbacBoardCache } from "@/commons/utils/rbacCache";
import { redisService } from "@/modules/redis/redis.service";

const boardListKey = (workspaceId: string) => `board:list:${workspaceId}`;
export const boardKey = (boardId: string) => `board:${boardId}`;
// const BOARD_TTL_SECONDS = 300; 

export class BoardService {
  constructor(
    private readonly boardRepo: IBoardRepository,
    private readonly templateRepo: ITemplateRepository  
  ) {}

  async getBoards(workspaceId: string): Promise<BoardResponse[]> {
    const cacheKey = boardListKey(workspaceId);
    try {
      const cached = await redisService.get<BoardResponse[]>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('board list cache get error', err);
    }

    const boards = await this.boardRepo.findBoards(workspaceId);
    if(boards.length === 0) {
      throw new NotFoundException("Boards not found");
    }

    try {
      await redisService.set(cacheKey, boards);
    } catch (err) {
      console.error('board list cache set error', err);
    }
    return boards;
  } 

  async getBoardById(boardId: string): Promise<BoardResponse | null> {
    const cacheKey = boardKey(boardId);
    try {
      const cached = await redisService.get<BoardResponse>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('board cache get error', err);
    }

    const board = await this.boardRepo.findBoardById(boardId);
    if(!board) {
      throw new NotFoundException("Board not found");
    }

    try {
      await redisService.set(cacheKey, board);
    } catch (err) {
      console.error('board cache set error', err);
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
    try {
      await redisService.del(boardListKey(workspaceId));
      await redisService.del(`workspace:list:${userId}`);
    } catch (err) {
      console.error('board list cache clear error', err);
    }
    return newBoard;
  }

  async updateBoard(boardData: BoardUpdateRequest): Promise<Board> {
    const updateBoard = await this.boardRepo.updateBoard(boardData);
    if(!updateBoard) {
      throw new InternalServerException("can not update board");
    }
    try {
      await redisService.del(boardKey(updateBoard.id));
      await redisService.del(boardListKey(boardData.workspaceId));
    } catch (err) {
      console.error('board cache clear error', err);
    }
    return updateBoard;
  }

  async deleteBoard(boarId: string, userId: string): Promise<void> {
    const board = await this.boardRepo.findBoardById(boarId);
    const isDelete = await this.boardRepo.deleteBoard(boarId);
    if(!isDelete) {
      throw new InternalServerException('can not delete board');
    }
    try {
      await redisService.del(boardKey(boarId));
      if(board?.workspaceId) {
        await redisService.del(boardListKey(board.workspaceId));
      }
      await redisService.del(`workspace:list:${userId}`);
    } catch (err) {
      console.error('board cache clear error', err);
    }
    await clearRbacBoardCache(boarId, userId);
  }

  async hardDeleteBoard(boardId: string, userId: string): Promise<void> {
    const isDelete = await this.boardRepo.hardDeleteBoard(boardId);
    if (!isDelete) {
      throw new InternalServerException('can not hard delete board');
    }
    try {
      await redisService.del(boardKey(boardId));
    } catch (err) {
      console.error('board cache clear error', err);
    }
    await clearRbacBoardCache(boardId, userId);
  }
}