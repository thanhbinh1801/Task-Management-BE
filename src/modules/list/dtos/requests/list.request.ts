import z from "zod"

export const ListCreateRequestSchema = z.object({
  nameList: z.string(),
});

export type ListCreateRequest = z.infer<typeof ListCreateRequestSchema>;

export const ListUpdateRequestSchema = z.object({
  listId: z.string(),
  boardId: z.string(),
  nameList: z.string(),
  leftId: z.string().optional(),
  rightId: z.string().optional(),
});

export type ListUpdateRequest = z.infer<typeof ListUpdateRequestSchema>;
