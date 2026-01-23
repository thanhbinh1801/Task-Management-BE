import { NextFunction, Request, Response } from "express";
import { ChecklistService } from "./checklist.service";

export class ChecklistController {
  private service: ChecklistService;

  constructor() {
    this.service = new ChecklistService();
  }

  getChecklistsByCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cardId } = req.params;

      const checklists = await this.service.getChecklistsByCard(cardId);
      res.status(200).json({
        status: "success",
        data: { checklists }
      });
    } catch (error) {
      next(error);
    }
  };

  createChecklist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cardId } = req.params;
      const data = req.body;

      const checklist = await this.service.createChecklist(cardId, data);
      res.status(201).json({
        status: "success",
        data: { checklist }
      });
    } catch (error) {
      next(error);
    }
  };

  deleteChecklist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cardId, checklistId } = req.params;

      await this.service.deleteChecklist(cardId, checklistId);
      res.status(200).json({
        status: "success",
        message: "Checklist deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  createChecklistItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cardId, checklistId } = req.params;
      const data = req.body;

      const item = await this.service.createChecklistItem(cardId, checklistId, data);
      res.status(201).json({
        status: "success",
        data: { item }
      });
    } catch (error) {
      next(error);
    }
  };

  updateChecklistItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cardId, checklistId, itemId } = req.params;
      const data = req.body;

      const item = await this.service.updateChecklistItem(cardId, checklistId, itemId, data);
      res.status(200).json({
        status: "success",
        data: { item }
      });
    } catch (error) {
      next(error);
    }
  };

  deleteChecklistItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { cardId, checklistId, itemId } = req.params;

      await this.service.deleteChecklistItem(cardId, checklistId, itemId);
      res.status(200).json({
        status: "success",
        message: "Checklist item deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  };
}
