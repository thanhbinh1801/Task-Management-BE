import z from "zod";

export const GetNotificationsQuerySchema = z.object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    isRead: z.coerce.boolean().optional(),
    type: z.string().optional(),
})

export type GetNotificationsQuery = z.infer<typeof GetNotificationsQuerySchema>;