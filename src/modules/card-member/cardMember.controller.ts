import { BadRequestException } from "@/commons";
import { NextFunction, Request, Response } from "express";
import { CardMemberAssignRequestSchema } from "./dtos/requests/cardMember.request";
import { CardMemberService } from "./cardMember.service";

export default class CardMemberController {
  constructor(private readonly cardMemberService: CardMemberService) {}

  getCardMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.cardId;

      if (!cardId) {
        throw new BadRequestException("cardId not found");
      }

      const { members } = await this.cardMemberService.getMembers(cardId);
      res.status(200).json({
        status: "success",
        message: "get card members successfully",
        data: members,
      });
    } catch (err) {
      next(err);
    }
  };

  assignMemberToCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.cardId;

      if (!cardId) {
        throw new BadRequestException("cardId not found");
      }

      const payload = CardMemberAssignRequestSchema.parse(req.body);
      await this.cardMemberService.assignMember(cardId, payload);

      res.status(201).json({
        status: "success",
        message: "assign member to card successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  removeMemberFromCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.cardId;
      const userId = req.params.userId;

      if (!cardId) {
        throw new BadRequestException("cardId not found");
      }
      if (!userId) {
        throw new BadRequestException("userId not found");
      }

      await this.cardMemberService.removeMember(cardId, userId);

      res.status(200).json({
        status: "success",
        message: "remove member from card successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
