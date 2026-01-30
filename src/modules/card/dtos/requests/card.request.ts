import z from "zod"

export const CardCreateRequestSchema = z.object({
  boardId: z.string(),
  name: z.string(),
});

export type CardCreateRequest = z.infer<typeof CardCreateRequestSchema>;

export const CardUpdateRequestSchema = z.object({
  cardId: z.string(),
  boardId: z.string(),
  name: z.string().optional(),
  listIdTarget: z.string().optional(),
  position: z.number().optional(),
});

export type CardUpdateRequest = z.infer<typeof CardUpdateRequestSchema>;
