import { BadRequestException } from "@/commons";
import {Request, Response, NextFunction } from "express";
import { CardService } from "./card.service";
import { CardCreateRequestSchema, CardUpdateRequestSchema } from "./dtos/requests/card.request";

export default class CardController {
  constructor( private readonly cardService : CardService){}

  getCards = async (req: Request, res: Response, next: NextFunction)=> {
    try {
      const listId = req.params.listId;
      if(!listId) {
        throw new BadRequestException("listId not found");
      }
      const cards = await this.cardService.getCards(listId);
      res.status(200).json({
        status: "success",
        message: "get cards successfully",
        data: cards
      });
    } 
    catch(err){
      next(err);
    }
  }

  getCardById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.cardId;

      if(!cardId) {
        throw new BadRequestException("cardId not found");
      }
      const card = await this.cardService.getCardById(cardId);
      res.status(200).json({
        status: "success",
        message: "get card by id successfully",
        data: card
      });
    } 
    catch(err){
      next(err);
    }
  }

  createCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listId = req.params.listId;
      if(!listId) {
        throw new BadRequestException("listId not found");
      }

      const { nameCard } = CardCreateRequestSchema.parse(req.body);
      const cardData = { nameCard }
      const newCard = await this.cardService.createCard(cardData, listId);
      res.status(201).json({
        status: "success",
        message: "create card successfully",
        data: newCard
      });
    } 
    catch(err){
      next(err);
    }
  }

  updateCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.cardId;
      const listId = req.params.listId;
      const boardId = req.params.boardId;
      
      if(!cardId) {
        throw new BadRequestException("cardId not found");
      }

      const cardData = CardUpdateRequestSchema.parse({
        cardId: cardId,
        nameCard: req.body?.nameCard,
        listIdTarget: req.body?.listIdTarget,
        position: req.body?.position,
      });

      const updatedCard = await this.cardService.updateCard(cardData, listId, boardId);
      res.status(200).json({
        status: "success",
        message: "update card successfully",
        data: updatedCard
      });
    } 
    catch(err){
      next(err);
    }
  }

  deleteCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.cardId;
      if(!cardId) {
        throw new BadRequestException("cardId not found");
      }
      
      // Check if permanent delete is requested via query parameter
      const isPermanent = req.query.permanent === 'true';
      
      if (isPermanent) {
        await this.cardService.hardDeleteCard(cardId);
      } else {
        await this.cardService.deleteCard(cardId);
      }
      
      res.status(200).json({
        status: "success",
        message: isPermanent ? "permanently deleted card successfully" : "soft deleted card successfully",
      });
    } 
    catch(err){
      next(err);
    }
  }
}