import z from "zod"

export const ListCreateRequestSchema = z.object({
  name: z.string(),
  boardId: z.string(),
});

export type ListCreateRequest = z.infer<typeof ListCreateRequestSchema>;

export const ListUpdateRequestSchema = z.object({
  listId: z.string(),
  boardId: z.string(),
  name: z.string().optional(),
  position: z.number().optional(),
});

export type ListUpdateRequest = z.infer<typeof ListUpdateRequestSchema>;
