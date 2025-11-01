import { InternalServerException, NotFoundException } from "@/commons";
import { ICardRepository } from "./repository/interfaces/ICardRepository";
import { Card } from "@prisma/client";
import { CardCreateRequest, CardUpdateRequest } from "./dtos/requests/card.request";

export class CardService {
  constructor( private readonly cardRepo: ICardRepository){}

  async getCards(listId: string): Promise<Card[]> {
    const cards = await this.cardRepo.findCards(listId);
    if(cards.length === 0) {
      throw new NotFoundException("Lists not found");
    }
    return cards;
  } 

  async getCardById(cardId: string): Promise<Card | null> {
    const card = await this.cardRepo.findCardById(cardId);
    if(!card) {
      throw new NotFoundException("Card not found");
    }
    return card;
  }

  async createCard(cardData: CardCreateRequest, listId: string): Promise<Card> {
    const newCard = await this.cardRepo.createCard(cardData, listId);
    if(!newCard) {
      throw new InternalServerException("can not create card");
    }
    return newCard;
  }

  async updateCard(cardData: CardUpdateRequest): Promise<Card> {
    const updatedCard = await this.cardRepo.updateCard(cardData);
    if(!updatedCard) {
      throw new InternalServerException("can not update card");
    }
    return updatedCard;
  }

  async deleteCard(cardId: string): Promise<void> {
    const isDelete = await this.cardRepo.deleteCard(cardId);
    if(!isDelete) {
      throw new InternalServerException('can not delete card');
    }
  }
}