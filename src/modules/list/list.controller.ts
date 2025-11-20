import { BadRequestException } from "@/commons";
import {Request, Response, NextFunction } from "express";
import { ListService } from "./list.service";
import { ListCreateRequestSchema, ListUpdateRequestSchema } from "./dtos/requests/list.request";

export default class ListController {
  constructor( private readonly listService : ListService){}

  getLists = async (req: Request, res: Response, next: NextFunction)=> {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException("boardId not found");
      }
      const lists = await this.listService.getLists(boardId);
      res.status(200).json({
        status: "success",
        message: "get lists successfully",
        data: lists
      });
    } 
    catch(err){
      next(err);
    }
  }

  getListById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      const listId = req.params.listId;

      if(!boardId) {
        throw new BadRequestException("boardId not found");
      }
      const list = await this.listService.getListById(listId);
      res.status(200).json({
        status: "success",
        message: "get list by id successfully",
        data: list
      });
    } 
    catch(err){
      next(err);
    }
  }

  createList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException("boardId not found");
      }
      
      const { nameList } = ListCreateRequestSchema.parse(req.body);
      const listData = { nameList }
      const newList = await this.listService.createList(listData, boardId);
      res.status(201).json({
        status: "success",
        message: "create list successfully",
        data: newList
      });
    } 
    catch(err){
      next(err);
    }
  }

  updateList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException("boardId not found");
      }

      const listId = req.params.listId;
      if(!listId) {
        throw new BadRequestException("listId not found");
      }

      if( ! req.body ){
        throw new BadRequestException("data of request body not found")
      }

      const listData = ListUpdateRequestSchema.parse({
      listId: listId,
      boardId: boardId,
      nameList: req.body?.nameList,
      leftId: req.body?.leftIndex,
      rightId: req.body?.rightIndex,
    });

      const updatedList = await this.listService.updateList(listData);
      res.status(200).json({
        status: "success",
        message: "update list successfully",
        data: updatedList
      });
    } 
    catch(err){
      next(err);
    }
  }

  deleteList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listId = req.params.listId;
      if(!listId) {
        throw new BadRequestException("listId not found");
      }
      
      // Check if permanent delete is requested via query parameter
      const isPermanent = req.query.permanent === 'true';
      
      if (isPermanent) {
        await this.listService.hardDeleteList(listId);
      } else {
        await this.listService.deleteList(listId);
      }
      
      res.status(200).json({
        status: "success",
        message: isPermanent ? "permanently deleted list successfully" : "soft deleted list successfully",
      });
    } 
    catch(err){
      next(err);
    }
  }
}