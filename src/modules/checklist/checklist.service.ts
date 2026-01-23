import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from "@/commons/exceptions";
// import { redis } from "@/configs/redis.config";
import { ChecklistCreateRequest, ChecklistItemCreateRequest, ChecklistItemUpdateRequest } from "./dtos/requests/checklist.request";
import { ChecklistResponse, ChecklistItemResponse } from "./dtos/responses/checklist.response";
import { ChecklistPrismaRepository } from "./repository/prisma/ChecklistPrismaRepository";

export class ChecklistService {
  private repository: ChecklistPrismaRepository;

  constructor() {
    this.repository = new ChecklistPrismaRepository();
  }

  async getChecklistsByCard(cardId: string): Promise<ChecklistResponse[]> {
    const cardWithBoard = await this.repository.findCardWithBoard(cardId);
    if (!cardWithBoard) {
      throw new NotFoundException("Card not found");
    }

    const checklists = await this.repository.getChecklistsByCard(cardId);
    return checklists;
  }

  async createChecklist(cardId: string, data: ChecklistCreateRequest): Promise<ChecklistResponse> {
    // Validate card exists
    const cardWithBoard = await this.repository.findCardWithBoard(cardId);
    if (!cardWithBoard) {
      throw new NotFoundException("Card not found");
    }

    // Validate input
    if (!data.name?.trim()) {
      throw new BadRequestException("Checklist name is required");
    }

    // Create checklist
    const checklist = await this.repository.createChecklist(cardId, data);

    // Invalidate cache
    await this.invalidateCardChecklistCache(cardId);

    return {
      id: checklist.id,
      name: checklist.name,
      cardId: checklist.cardId,
      items: [],
    };
  }

  async deleteChecklist(cardId: string, checklistId: string): Promise<void> {
    // Validate card exists
    const cardWithBoard = await this.repository.findCardWithBoard(cardId);
    if (!cardWithBoard) {
      throw new NotFoundException("Card not found");
    }

    // Validate checklist exists
    const checklist = await this.repository.findChecklist(checklistId);
    if (!checklist) {
      throw new NotFoundException("Checklist not found");
    }

    // Ensure checklist belongs to card
    if (checklist.cardId !== cardId) {
      throw new BadRequestException("Checklist does not belong to this card");
    }

    // Delete checklist
    await this.repository.deleteChecklist(checklistId);

    // Invalidate cache
    await this.invalidateCardChecklistCache(cardId);
  }

  async createChecklistItem(cardId: string, checklistId: string, data: ChecklistItemCreateRequest): Promise<ChecklistItemResponse> {
    // Validate card exists
    const cardWithBoard = await this.repository.findCardWithBoard(cardId);
    if (!cardWithBoard) {
      throw new NotFoundException("Card not found");
    }

    // Validate checklist exists
    const checklist = await this.repository.findChecklist(checklistId);
    if (!checklist) {
      throw new NotFoundException("Checklist not found");
    }

    // Ensure checklist belongs to card
    if (checklist.cardId !== cardId) {
      throw new BadRequestException("Checklist does not belong to this card");
    }

    // Validate input
    if (!data.name?.trim()) {
      throw new BadRequestException("Item name is required");
    }

    // Create item
    const item = await this.repository.createChecklistItem(checklistId, data);

    // Invalidate cache
    await this.invalidateCardChecklistCache(cardId);

    return {
      id: item.id,
      name: item.name,
      isComplete: item.isComplete,
      position: item.position,
      checklistId: item.checklistId,
    };
  }

  async updateChecklistItem(cardId: string, checklistId: string, itemId: string, data: ChecklistItemUpdateRequest): Promise<ChecklistItemResponse> {
    // Validate card exists
    const cardWithBoard = await this.repository.findCardWithBoard(cardId);
    if (!cardWithBoard) {
      throw new NotFoundException("Card not found");
    }

    // Validate checklist exists
    const checklist = await this.repository.findChecklist(checklistId);
    if (!checklist) {
      throw new NotFoundException("Checklist not found");
    }

    // Ensure checklist belongs to card
    if (checklist.cardId !== cardId) {
      throw new BadRequestException("Checklist does not belong to this card");
    }

    // Validate item exists
    const item = await this.repository.findChecklistItem(itemId);
    if (!item) {
      throw new NotFoundException("Checklist item not found");
    }

    // Ensure item belongs to checklist
    if (item.checklistId !== checklistId) {
      throw new BadRequestException("Item does not belong to this checklist");
    }

    // Validate input
    if (data.name !== undefined && !data.name.trim()) {
      throw new BadRequestException("Item name cannot be empty");
    }

    // Update item
    const updatedItem = await this.repository.updateChecklistItem(itemId, data);

    // Invalidate cache
    await this.invalidateCardChecklistCache(cardId);

    return {
      id: updatedItem.id,
      name: updatedItem.name,
      isComplete: updatedItem.isComplete,
      position: updatedItem.position,
      checklistId: updatedItem.checklistId,
    };
  }

  async deleteChecklistItem(cardId: string, checklistId: string, itemId: string): Promise<void> {
    // Validate card exists
    const cardWithBoard = await this.repository.findCardWithBoard(cardId);
    if (!cardWithBoard) {
      throw new NotFoundException("Card not found");
    }

    // Validate checklist exists
    const checklist = await this.repository.findChecklist(checklistId);
    if (!checklist) {
      throw new NotFoundException("Checklist not found");
    }

    // Ensure checklist belongs to card
    if (checklist.cardId !== cardId) {
      throw new BadRequestException("Checklist does not belong to this card");
    }

    // Validate item exists
    const item = await this.repository.findChecklistItem(itemId);
    if (!item) {
      throw new NotFoundException("Checklist item not found");
    }

    // Ensure item belongs to checklist
    if (item.checklistId !== checklistId) {
      throw new BadRequestException("Item does not belong to this checklist");
    }

    // Delete item
    await this.repository.deleteChecklistItem(itemId);

    // Invalidate cache
    await this.invalidateCardChecklistCache(cardId);
  }

  // Public helper for router middleware
  async ensureCard(cardId: string): Promise<{ id: string; boardId: string }> {
    const cardWithBoard = await this.repository.findCardWithBoard(cardId);
    if (!cardWithBoard) {
      throw new NotFoundException("Card not found");
    }
    return cardWithBoard;
  }

  private async invalidateCardChecklistCache(cardId: string): Promise<void> {
    // TODO: Implement Redis cache invalidation when redis is properly configured
    // const cacheKey = `checklist:card:${cardId}`;
    // await redis.del(cacheKey);
  }
}
