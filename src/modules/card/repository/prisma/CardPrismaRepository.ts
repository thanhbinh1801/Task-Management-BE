import { ICardRepository } from "../interfaces/ICardRepository";
import { prisma } from "@/configs";
import { Card, Prisma } from "@prisma/client";
import { CardCreateRequest, CardUpdateRequest } from "../../dtos/requests/card.request";
import { NotFoundException, ConflictException } from "@/commons";

export class CardPrismaRepository implements ICardRepository {
  async findCards(listId: string): Promise<Card[]> {
    return prisma.card.findMany({
      where: {listId: listId, deletedAt: null},
      orderBy: { position: 'asc' }
    });
  }

  async findCardById(cardId: string): Promise<Card | null> {
    return prisma.card.findFirst({
      where: { id: cardId, deletedAt: null },
      orderBy: { position: 'asc' }
    });
  }

  async createCard(cardData: CardCreateRequest, listId: string, position: number): Promise<Card>{ 
    return prisma.card.create({
      data: {
        name: cardData.nameCard,
        listId: listId,
        position: new Prisma.Decimal(position),
      },
    });
  }

  async updateCard(cardData: CardUpdateRequest): Promise<Card> {
    return prisma.card.update({
      where: { id: cardData.cardId },
      data: {
        ...( cardData.nameCard && { name: cardData.nameCard }),
        ...( cardData.listIdTarget && { listId: cardData.listIdTarget }),
        ...( cardData.position && { position: new Prisma.Decimal(cardData.position) }),
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

  async findMaxPositionOfCardInList(listId: string): Promise<number> {
    const maxPositionList = await prisma.card.findFirst({
      where: { listId: listId, deletedAt: null },
      orderBy: { position: 'desc' },
    });
    return maxPositionList?.position.toNumber() ?? 0;
  }
}