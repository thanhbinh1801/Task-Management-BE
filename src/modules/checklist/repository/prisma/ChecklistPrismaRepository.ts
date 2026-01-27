import { prisma } from "@/configs";
import { Checklist, ChecklistItem } from "@prisma/client";
import { ChecklistItemResponse, ChecklistResponse } from "../../dtos/responses/checklist.response";
import { ChecklistCreateRequest, ChecklistItemCreateRequest, ChecklistItemUpdateRequest } from "../../dtos/requests/checklist.request";
import { IChecklistRepository } from "../interfaces/IChecklistRepository";

export class ChecklistPrismaRepository implements IChecklistRepository {
  async findCardWithBoard(cardId: string): Promise<{ id: string; boardId: string } | null> {
    const card = await prisma.card.findFirst({
      where: { id: cardId, deletedAt: null },
      select: { id: true, list: { select: { boardId: true } } },
    });

    if (!card) return null;
    return { id: card.id, boardId: card.list.boardId };
  }

  async findChecklist(checklistId: string): Promise<Checklist | null> {
    return prisma.checklist.findUnique({
      where: { id: checklistId },
    });
  }

  async createChecklist(cardId: string, data: ChecklistCreateRequest): Promise<Checklist> {
    return prisma.checklist.create({
      data: {
        name: data.name,
        cardId,
      },
    });
  }

  async deleteChecklist(checklistId: string): Promise<Checklist> {
    return prisma.checklist.delete({
      where: { id: checklistId },
    });
  }

  async getChecklistsByCard(cardId: string): Promise<ChecklistResponse[]> {
    const checklists = await prisma.checklist.findMany({
      where: { cardId },
      include: {
        items: {
          orderBy: { position: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return checklists.map((checklist) => ({
      id: checklist.id,
      name: checklist.name,
      cardId: checklist.cardId,
      items: checklist.items.map((item) => ({
        id: item.id,
        name: item.name,
        isComplete: item.isComplete,
        position: item.position,
        checklistId: item.checklistId,
      })),
    }));
  }

  async findChecklistItem(itemId: string): Promise<ChecklistItem | null> {
    return prisma.checklistItem.findUnique({
      where: { id: itemId },
    });
  }

  async createChecklistItem(checklistId: string, data: ChecklistItemCreateRequest): Promise<ChecklistItem> {
    const maxPosition = await this.findMaxPositionInChecklist(checklistId);
    return prisma.checklistItem.create({
      data: {
        name: data.name,
        checklistId,
        position: maxPosition + 1,
      },
    });
  }

  async updateChecklistItem(itemId: string, data: ChecklistItemUpdateRequest): Promise<ChecklistItem> {
    return prisma.checklistItem.update({
      where: { id: itemId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.isComplete !== undefined && { isComplete: data.isComplete }),
        ...(data.position !== undefined && { position: data.position }),
      },
    });
  }

  async deleteChecklistItem(itemId: string): Promise<ChecklistItem> {
    return prisma.checklistItem.delete({
      where: { id: itemId },
    });
  }

  async findMaxPositionInChecklist(checklistId: string): Promise<number> {
    const maxPositionItem = await prisma.checklistItem.findFirst({
      where: { checklistId },
      orderBy: { position: "desc" },
    });
    return maxPositionItem?.position ?? 0;
  }
}
