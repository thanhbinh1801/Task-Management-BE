import z from "zod";

import { UserStatusEnum } from "@prisma/client";

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalItems: z.number(),
  totalPages: z.number()
})

export const UserResponseSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  email: z.string().email(),
  status: z.nativeEnum(UserStatusEnum).default(UserStatusEnum.ACTIVE),
});

export type UserManagementResponse = z.infer<typeof UserResponseSchema>

export const UserPaginationResponseSchema = z.object({
  data: z.array(UserResponseSchema),
  meta: PaginationSchema
})

export type UserResponse = z.infer< typeof UserPaginationResponseSchema>;