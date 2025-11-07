import { ICardRepository } from "../interfaces/ICardRepository";
import { prisma } from "@/configs";
import { Card } from "@prisma/client";
import { CardCreateRequest, CardUpdateRequest } from "../../dtos/requests/card.request";
import { NotFoundException, ConflictException } from "@/commons";

export class CardPrismaRepository implements ICardRepository {
  async findCards(listId: string): Promise<Card[]> {
    return prisma.card.findMany({
      where: {listId: listId, deletedAt: null}
    });
  }

  async findCardById(cardId: string): Promise<Card | null> {
    return prisma.card.findFirst({
      where: { id: cardId, deletedAt: null }
    });
  }

  async createCard(cardData: CardCreateRequest, listId: string): Promise<Card>{ 
    return prisma.card.create({
      data: {
        name: cardData.nameCard,
        listId: listId,
      },
    });
  }

  async updateCard(cardData: CardUpdateRequest): Promise<Card> {
    return prisma.card.update({
      where: { id: cardData.cardId },
      data: {
        ...( cardData.nameCard && { name: cardData.nameCard }),
      },
    });
  }

  async deleteCard(cardId: string): Promise<Card> {
    return prisma.card.update({
      where: { id: cardId },
      data: {
        deletedAt: new Date(),
      }
    })
  }

  async hardDeleteCard(cardId: string): Promise<Card> {
    const card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      throw new NotFoundException("Card not found");
    }

    if(!card.deletedAt) {
      throw new ConflictException("Cannot hard delete a card that is not soft deleted");
    }
    
    return prisma.card.delete({
      where: { id: cardId }
    });
  }
}