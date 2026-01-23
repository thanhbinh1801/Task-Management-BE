import z from "zod";

// Interfaces
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

// Zod Schemas for OpenAPI
export const ChecklistItemResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  isComplete: z.boolean(),
  position: z.number(),
  checklistId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ChecklistResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  cardId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(ChecklistItemResponseSchema),
});

export const GetChecklistsResponseSchema = z.object({
  status: z.string(),
  data: z.object({
    checklists: z.array(ChecklistResponseSchema),
  }),
});

export const CreateChecklistResponseSchema = z.object({
  status: z.string(),
  data: z.object({
    checklist: z.object({
      id: z.string(),
      name: z.string(),
      cardId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      items: z.array(z.any()),
    }),
  }),
});

export const CreateChecklistItemResponseSchema = z.object({
  status: z.string(),
  data: z.object({
    item: ChecklistItemResponseSchema,
  }),
});

export const UpdateChecklistItemResponseSchema = z.object({
  status: z.string(),
  data: z.object({
    item: ChecklistItemResponseSchema,
  }),
});

export const DeleteResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
});
