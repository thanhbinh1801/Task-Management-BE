import { Card } from "@prisma/client";
import { CardCreateRequest, CardUpdateRequest } from "../../dtos/requests/card.request";

export  interface ICardRepository {
  findCards(boardId: string): Promise<Card[]>;
  findCardById(cardId: string): Promise<Card | null>;
  createCard(cardData: CardCreateRequest, listId: string, position: number): Promise<Card>;
  updateCard(cardData: CardUpdateRequest): Promise<Card>;
  deleteCard(cardId: string): Promise<Card>;
  hardDeleteCard(cardId: string): Promise<Card>;
  findMaxPositionOfCardInList(listId: string): Promise<number>;
}