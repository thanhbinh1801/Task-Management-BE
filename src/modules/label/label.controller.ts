import { BadRequestException } from "@/commons";
import { NextFunction, Request, Response } from "express";
import {
  CardLabelAssignRequestSchema,
  LabelCreateRequestSchema,
  LabelUpdateRequestSchema,
} from "./dtos/requests/label.request";
import { LabelService } from "./label.service";

export default class LabelController {
  constructor(private readonly labelService: LabelService) {}

  createLabel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if (!boardId) {
        throw new BadRequestException("boardId not found");
      }

      const payload = LabelCreateRequestSchema.parse(req.body);
      const label = await this.labelService.createLabel(boardId, payload);

      res.status(201).json({
        status: "success",
        message: "create label successfully",
        data: label,
      });
    } catch (err) {
      next(err);
    }
  };

  getBoardLabels = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if (!boardId) {
        throw new BadRequestException("boardId not found");
      }

      const labels = await this.labelService.getBoardLabels(boardId);
      res.status(200).json({
        status: "success",
        message: "get labels successfully",
        data: labels,
      });
    } catch (err) {
      next(err);
    }
  };

  updateLabel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      const labelId = req.params.labelId;

      if (!boardId) {
        throw new BadRequestException("boardId not found");
      }
      if (!labelId) {
        throw new BadRequestException("labelId not found");
      }

      const payload = LabelUpdateRequestSchema.parse({
        labelId,
        name: req.body?.name,
        color: req.body?.color,
      });

      const label = await this.labelService.updateLabel(boardId, labelId, payload);
      res.status(200).json({
        status: "success",
        message: "update label successfully",
        data: label,
      });
    } catch (err) {
      next(err);
    }
  };

  deleteLabel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      const labelId = req.params.labelId;

      if (!boardId) {
        throw new BadRequestException("boardId not found");
      }
      if (!labelId) {
        throw new BadRequestException("labelId not found");
      }

      await this.labelService.deleteLabel(boardId, labelId);
      res.status(200).json({
        status: "success",
        message: "delete label successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  getLabelsOfCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      const cardId = req.params.cardId;

      if (!boardId) {
        throw new BadRequestException("boardId not found");
      }
      if (!cardId) {
        throw new BadRequestException("cardId not found");
      }

      const labels = await this.labelService.getLabelsOfCard(boardId, cardId);
      res.status(200).json({
        status: "success",
        message: "get label in card successfully",
        data: labels,
      });
    } catch (err) {
      next(err);
    }
  };

  assignLabelToCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      const cardId = req.params.cardId;

      if (!boardId) {
        throw new BadRequestException("boardId not found");
      }
      if (!cardId) {
        throw new BadRequestException("cardId not found");
      }

      const payload = CardLabelAssignRequestSchema.parse(req.body);
      await this.labelService.assignLabelToCard(boardId, cardId, payload);

      res.status(200).json({
        status: "success",
        message: "assign label to card successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  removeLabelFromCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      const cardId = req.params.cardId;
      const labelId = req.params.labelId;

      if (!boardId) {
        throw new BadRequestException("boardId not found");
      }
      if (!cardId) {
        throw new BadRequestException("cardId not found");
      }
      if (!labelId) {
        throw new BadRequestException("labelId not found");
      }

      await this.labelService.removeLabelFromCard(boardId, cardId, labelId);
      res.status(200).json({
        status: "success",
        message: "remove label in card successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
