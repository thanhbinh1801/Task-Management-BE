import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "@/commons";
import BoardJoinLinkService from "./boardJoinLink.service";

export default class BoardJoinLinkController{
  constructor(private readonly boardJoinLinkService: BoardJoinLinkService) {}

  createLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException(' boardId not found');
      }
      const userId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException(' userId not found');
      }
      const newLink = await this.boardJoinLinkService.createLink(boardId, userId);
      res.status(201).json({
        status: "success",
        message: "create link to join board successfully",
        json: newLink
      });

    } catch (err) {
      next(err);
    }
  }

  revokeLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const linkId = req.params.linkId;
      if(!linkId) {
        throw new BadRequestException(' linkId not found');
      }
      await this.boardJoinLinkService.revokeLink(linkId);
      res.status(200).json({
        status: "success",
        message: "revoke link to join workspace successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}