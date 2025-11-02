import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "@/commons";
import MemberWorkspaceService from "./member.board.service";

export default class MemberWorkspaceController {
  constructor(private readonly memberService: MemberWorkspaceService) {}

  addMemberBoardByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException(' board id not found');
      }
      const email = req.body.email;
      if(!email) {
        throw new BadRequestException(' email not found');
      }
      const newMember = await this.memberService.addMemberBoardByEmail(email, boardId);
      res.status(201).json({
        status: "success",
        message: "add board member successfully",
        json: newMember
      });

    } catch (err) {
      next(err);
    }
  }

  viewMemberBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException(' board id not found');
      }
      const allMembers = await this.memberService.getMember(boardId);
      res.status(200).json({
        status: "success",
        message: "get all board member successfully",
        json: allMembers
      });
    } catch (err) {
      next(err);
    }
  }

  changePermissionMemberBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException(' board id not found');
      }
      const userId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException(' userId id not found');
      }
      const role = req.body.role;
      if(!role) {
        throw new BadRequestException(' role not found');
      }
      const updateMember = await this.memberService.updateMember(boardId, userId, role);
      res.status(200).json({
        status: "success",
        message: "change permission board member successfully",
        json: updateMember
      });
    } catch (err) {
      next(err);
    }
  }


  removeMemberBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException(' board id not found');
      }
      const userId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException(' userId id not found');
      }
      const removeMember = await this.memberService.removeMember(boardId, userId);
      res.status(200).json({
        status: "success",
        message: "remove board member successfully",
        json: removeMember
      });
    } catch (err) {
      next(err);
    }
  }
}