import z from "zod"

export const MemberCreateByEmailRequestSchema = z.object({
  email: z.string()
});

export type MemberCreateByEmailRequest = z.infer<typeof MemberCreateByEmailRequestSchema>