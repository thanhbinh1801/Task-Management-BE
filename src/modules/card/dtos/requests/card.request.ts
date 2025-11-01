import z from "zod"

export const CardCreateRequestSchema = z.object({
  nameCard: z.string(),
});

export type CardCreateRequest = z.infer<typeof CardCreateRequestSchema>;

export const CardUpdateRequestSchema = z.object({
  cardId: z.string(),
  boardId: z.string(),
  nameCard: z.string(),
});

export type CardUpdateRequest = z.infer<typeof CardUpdateRequestSchema>;
