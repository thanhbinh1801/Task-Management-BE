import { BadRequestException } from "@/commons";
import {Request, Response, NextFunction } from "express";
import { BoardCreateRequestSchema, BoardUpdateRequestSchema } from "./dtos/requests/board.request";
import { BoardService } from "./board.service";

export default class BoardController {
  constructor( private readonly boardService : BoardService){}

  getBoards = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException("workspaceId not found");
      }
      const boards = await this.boardService.getBoards(workspaceId);
      res.status(200).json({
        status: "success",
        message: "get board successfully",
        data: boards
      });
    } 
    catch(err){
      next(err);
    }
  }

  getBoardById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException("boardId not found");
      }
      const board = await this.boardService.getBoardById(boardId);
      res.status(200).json({
        status: "success",
        message: "get board by id successfully",
        data: board
      });
    } 
    catch(err){
      next(err);
    }
  }

  createBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException("workspaceId not found");
      }
      const userId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException("userId not found");
      }

      const { nameBoard } = BoardCreateRequestSchema.parse(req.body);
      const boardData = { nameBoard }
      const newBoard = await this.boardService.createBoard(boardData, workspaceId, userId);
      res.status(201).json({
        status: "success",
        message: "create board successfully",
        data: newBoard
      });
    } 
    catch(err){
      next(err);
    }
  }

  updateBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException("workspaceId not found");
      }
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException("boardId not found");
      }

      const boardData = BoardUpdateRequestSchema.parse({
      workspaceId: req.params.workspaceId,
      boardId: req.params.boardId,
      nameBoard: req.body?.nameBoard,
    });

      const updatedBoard = await this.boardService.updateBoard(boardData);
      res.status(200).json({
        status: "success",
        message: "update board successfully",
        data: updatedBoard
      });
    } 
    catch(err){
      next(err);
    }
  }

  deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException("boardId not found");
      }
      await this.boardService.deleteBoard(boardId);
      res.status(200).json({
        status: "success",
        message: "delete board successfully",
      });
    } 
    catch(err){
      next(err);
    }
  }
}