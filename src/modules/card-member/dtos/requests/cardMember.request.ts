import z from "zod";

export const CardMemberAssignRequestSchema = z.object({
  userId: z.string(),
});

export type CardMemberAssignRequest = z.infer<typeof CardMemberAssignRequestSchema>;
