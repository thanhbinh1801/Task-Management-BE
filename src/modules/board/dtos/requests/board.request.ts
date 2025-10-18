import z from "zod"

export const BoardCreateRequestSchema = z.object({
  nameBoard: z.string(),
});

export type BoardCreateRequest = z.infer<typeof BoardCreateRequestSchema>;

export const BoardUpdateRequestSchema = z.object({
  boardId: z.string(),
  workspaceId: z.string(),
  nameBoard: z.string()
});

export type BoardUpdateRequest = z.infer<typeof BoardUpdateRequestSchema>;
