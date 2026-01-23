import { InternalServerException, NotFoundException } from "@/commons";
import { ICardRepository } from "./repository/interfaces/ICardRepository";
import { Card } from "@prisma/client";
import { CardCreateRequest, CardUpdateRequest } from "./dtos/requests/card.request";
import { redisService } from "@/modules/redis/redis.service";
import { boardKey } from "@/modules/board/board.service";

const cardPerListKey = (listId: string) => `card:list:${listId}`;
export const cardKey = (cardId: string) => `card:${cardId}`;
const CARD_TTL_SECONDS = 300; // 5 minutes

export class CardService {
  constructor( private readonly cardRepo: ICardRepository){}

  async getCards(listId: string): Promise<Card[]> {
    const cacheKey = cardPerListKey(listId);
    try {
      const cached = await redisService.get<Card[]>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('card list cache get error', err);
    }

    const cards = await this.cardRepo.findCards(listId);
    if(cards.length === 0) {
      throw new NotFoundException("Lists not found");
    }

    try {
      await redisService.set(cacheKey, cards, CARD_TTL_SECONDS);
    } catch (err) {
      console.error('card list cache set error', err);
    }
    return cards;
  } 

  async getCardById(cardId: string): Promise<Card | null> {
    const cacheKey = cardKey(cardId);
    try {
      const cached = await redisService.get<Card>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('card detail cache get error', err);
    }

    const card = await this.cardRepo.findCardById(cardId);
    if(!card) {
      throw new NotFoundException("Card not found");
    }

    try {
      await redisService.set(cacheKey, card, CARD_TTL_SECONDS);
    } catch (err) {
      console.error('card detail cache set error', err);
    }
    return card;
  }

  async createCard(cardData: CardCreateRequest, listId: string): Promise<Card> {
    const position = await this.cardRepo.findMaxPositionOfCardInList(listId) + 1000;
    const newCard = await this.cardRepo.createCard(cardData, listId, position);
    if(!newCard) {
      throw new InternalServerException("can not create card");
    }
    try {
      await redisService.del(cardPerListKey(listId));
    } catch (err) {
      console.error('card list cache clear error', err);
    }
    return newCard;
  }

  async updateCard(cardData: CardUpdateRequest, listId: string, boardId: string): Promise<Card> {
    const updatedCard = await this.cardRepo.updateCard(cardData);
    if(!updatedCard) {
      throw new InternalServerException("can not update card");
    }
    try {
      await redisService.del(cardKey(updatedCard.id));
      await redisService.del(cardPerListKey(listId)); // List cũ
      await redisService.del(boardKey(boardId)); // Board cache
      
      // Nếu move card sang list khác, xóa cache list mới
      if (cardData.listIdTarget && cardData.listIdTarget !== listId) {
        await redisService.del(cardPerListKey(cardData.listIdTarget));
      }
    } catch (err) {
      console.error('card cache clear error', err);
    }
    return updatedCard;
  }

  async deleteCard(cardId: string): Promise<void> {
    const isDelete = await this.cardRepo.deleteCard(cardId);
    if(!isDelete) {
      throw new InternalServerException('can not delete card');
    }
    try {
      await redisService.del(cardKey(cardId));
    } catch (err) {
      console.error('card cache clear error', err);
    }
  }

  async hardDeleteCard(cardId: string): Promise<void> {
    const isDelete = await this.cardRepo.hardDeleteCard(cardId);
    if (!isDelete) {
      throw new InternalServerException('can not hard delete card');
    }
    try {
      await redisService.del(cardKey(cardId));
    } catch (err) {
      console.error('card cache clear error', err);
    }
  }
}