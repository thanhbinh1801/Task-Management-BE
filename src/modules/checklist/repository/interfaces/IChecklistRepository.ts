import { Checklist, ChecklistItem } from "@prisma/client";
import { ChecklistItemResponse, ChecklistResponse } from "../../dtos/responses/checklist.response";
import { ChecklistCreateRequest, ChecklistItemCreateRequest, ChecklistItemUpdateRequest } from "../../dtos/requests/checklist.request";

export interface IChecklistRepository {
  findCardWithBoard(cardId: string): Promise<{ id: string; boardId: string } | null>;
  findChecklist(checklistId: string): Promise<Checklist | null>;
  createChecklist(cardId: string, data: ChecklistCreateRequest): Promise<Checklist>;
  deleteChecklist(checklistId: string): Promise<Checklist>;
  getChecklistsByCard(cardId: string): Promise<ChecklistResponse[]>;
  findChecklistItem(itemId: string): Promise<ChecklistItem | null>;
  createChecklistItem(checklistId: string, data: ChecklistItemCreateRequest): Promise<ChecklistItem>;
  updateChecklistItem(itemId: string, data: ChecklistItemUpdateRequest): Promise<ChecklistItem>;
  deleteChecklistItem(itemId: string): Promise<ChecklistItem>;
  findMaxPositionInChecklist(checklistId: string): Promise<number>;
}
