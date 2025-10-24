import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "@/commons";
import MemberWorkspaceService from "./member.workspace.service";

export default class MemberWorkspaceController {
  constructor(private readonly memberService: MemberWorkspaceService) {}

  addMemberWorkspaceByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException(' workspace id not found');
      }
      const email = req.body.email;
      if(!email) {
        throw new BadRequestException(' email not found');
      }
      const newMember = await this.memberService.addMemberWorkspaceByEmail(email, workspaceId);
      res.status(201).json({
        status: "success",
        message: "add workspace member successfully",
        json: newMember
      });

    } catch (err) {
      next(err);
    }
  }
  
  viewMemberWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException(' workspace id not found');
      }
      const allMembers = await this.memberService.getMember(workspaceId);
      res.status(200).json({
        status: "success",
        message: "get all workspace member successfully",
        json: allMembers
      });
    } catch (err) {
      next(err);
    }
  }

  changePermissionMemberWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException(' workspace id not found');
      }
      const userId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException(' userId id not found');
      }
      const role = req.body.role;
      if(!role) {
        throw new BadRequestException(' role not found');
      }
      const updateMember = await this.memberService.updateMember(workspaceId, userId, role);
      res.status(200).json({
        status: "success",
        message: "change permission workspace member successfully",
        json: updateMember
      });
    } catch (err) {
      next(err);
    }
  }


  removeMemberWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException(' workspace id not found');
      }
      const userId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException(' userId id not found');
      }
      const removeMember = await this.memberService.removeMember(workspaceId, userId);
      res.status(200).json({
        status: "success",
        message: "remove workspace member successfully",
        json: removeMember
      });
    } catch (err) {
      next(err);
    }
  }
}