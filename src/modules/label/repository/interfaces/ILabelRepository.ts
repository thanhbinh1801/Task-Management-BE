import { Board, CardLabel, Label } from "@prisma/client";
import { LabelCreateRequest, LabelUpdateRequest } from "../../dtos/requests/label.request";
import { LabelResponse } from "../../dtos/responses/label.response";

export interface ILabelRepository {
  findBoardById(boardId: string): Promise<Board | null>;
  createLabel(boardId: string, data: LabelCreateRequest): Promise<Label>;
  findLabelsByBoard(boardId: string): Promise<LabelResponse[]>;
  findLabelById(labelId: string): Promise<Label | null>;
  updateLabel(labelId: string, data: LabelUpdateRequest): Promise<Label>;
  softDeleteLabel(labelId: string): Promise<Label>;
  findCardWithBoard(cardId: string): Promise<{ id: string; boardId: string; listId: string } | null>;
  getCardLabels(cardId: string): Promise<LabelResponse[]>;
  findCardLabel(cardId: string, labelId: string): Promise<CardLabel | null>;
  assignLabelToCard(cardId: string, labelId: string): Promise<CardLabel>;
  removeLabelFromCard(cardId: string, labelId: string): Promise<CardLabel>;
}
