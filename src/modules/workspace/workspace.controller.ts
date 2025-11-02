import { Request, Response, NextFunction } from "express";
import WorkspaceService from "./workspace.service";
import { WorkspaceCreateRequestSchema, WorkspaceUpdateRequestSchema } from "./dtos/requests/workspace.request";
import { BadRequestException } from "@/commons";

export default class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  getWorkspaces = async (req: Request, res: Response, next: NextFunction) => {
    try{
      const userId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException(' user id not found');
      }
      const allWorkspace = await this.workspaceService.getWorkspaces(userId);
      res.status(200).json({
        status: "success",
        message: "get workspace successfully",
        data: allWorkspace
      });
    } catch (err) {
      next(err);
    }
  }

  getWorkspaceById = async (req: Request, res: Response, next: NextFunction) => {
    try{
      const workspaceId = req.params.workspaceId;
      const workspace = await this.workspaceService.getWorkspaceById(workspaceId);
      res.status(200).json({
        status: "success",
        message: "get workspace by id successfully",
        data: workspace
      });
    } catch(err) {
      next(err);
    }
  }

  createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.users?.userId as string;
      const dataWorkspace = WorkspaceCreateRequestSchema.parse(req.body);
      if(!dataWorkspace) {
        throw new BadRequestException('data workspace not found');
      }
      const newWorkspace = await this.workspaceService.createWorkspace(dataWorkspace, userId);
      res.status(201).json({
        status: "success",
        message: "create workspace successfully",
        data: newWorkspace
      });
    } catch(err){
      next(err);
    }
  }
  
  updateWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      const dataWorkspace = WorkspaceUpdateRequestSchema.parse(req.body);
      if(!dataWorkspace) {
        throw new BadRequestException('data workspace not found');
      }
      const updateWorkspace = await this.workspaceService.updateWorkspace(dataWorkspace, workspaceId);
      res.status(200).json({
        status: "success",
        message: "update workspace successfully",
        data: updateWorkspace
      });
    } catch (err) {
      next(err);
    }
  }

  deleteWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException(' workspace id not found');
      }
      await this.workspaceService.deleteWorkspace(workspaceId);
      res.status(200).json({
        status: "success",
        message: "update workspace successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}