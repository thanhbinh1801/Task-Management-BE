import z from "zod";

export const ChecklistCreateRequestSchema = z.object({
  name: z.string().min(1, "Checklist name is required"),
});

export const ChecklistItemCreateRequestSchema = z.object({
  name: z.string().min(1, "Item name is required"),
});

export const ChecklistItemUpdateRequestSchema = z.object({
  name: z.string().min(1).optional(),
  isComplete: z.boolean().optional(),
  position: z.number().optional(),
});

export type ChecklistCreateRequest = z.infer<typeof ChecklistCreateRequestSchema>;
export type ChecklistItemCreateRequest = z.infer<typeof ChecklistItemCreateRequestSchema>;
export type ChecklistItemUpdateRequest = z.infer<typeof ChecklistItemUpdateRequestSchema>;
