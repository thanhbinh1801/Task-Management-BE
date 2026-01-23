export interface ChecklistItemResponse {
  id: string;
  name: string;
  isComplete: boolean;
  position: number;
  checklistId: string;
}

export interface ChecklistResponse {
  id: string;
  name: string;
  cardId: string;
  items?: ChecklistItemResponse[];
}
