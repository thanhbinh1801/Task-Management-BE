import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "@/commons";
import WorkspaceJoinLinkService from "./workspaceJoinLink.service";

export default class WorkspaceJoinLinkController{
  constructor(private readonly workspaceJoinLinkService: WorkspaceJoinLinkService) {}

  createLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException(' workspaceId not found');
      }
      const userId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException(' userId not found');
      }
      const newLink = await this.workspaceJoinLinkService.createLink(workspaceId, userId);
      res.status(201).json({
        status: "success",
        message: "create link to join workspace successfully",
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
      await this.workspaceJoinLinkService.revokeLink(linkId);
      res.status(200).json({
        status: "success",
        message: "revoke link to join workspace successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}