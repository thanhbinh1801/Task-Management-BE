import z from "zod";
import { UserStatusEnum } from "@prisma/client";

export const UserRequestSchema = z.object({
  skip: z.number().int(),
  take: z.number().int(),
  name: z.string().optional(),
  email: z.string().optional()
})

export type UserRequest = z.infer<typeof UserRequestSchema>;

export const UserUpdateRequestSchema = z.object({
  id: z.string().cuid(),
  name: z.string().optional(),
  email: z.string().optional(),
  status: z.enum(UserStatusEnum).default(UserStatusEnum.ACTIVE).optional(),
  // avatarUrl: z.string().optional(),
  emailVerifiedAt: z.date().optional().transform( (val) => ( val !== undefined ? new Date() : undefined))
});

export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>

export const UserRegisterRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  status: z.nativeEnum(UserStatusEnum).default(UserStatusEnum.ACTIVE),
  avatarUrl: z.string().default("https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"),
  passwordHash: z.string()
})

export type UserRegisterRequest = z.infer<typeof UserRegisterRequestSchema>

export const UserRegisterRequestGoogleSchema = z.object({
  name: z.string(),
  email: z.string(),
  status: z.nativeEnum(UserStatusEnum).default(UserStatusEnum.ACTIVE),
  avatarUrl: z.string().url().default("https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"),
  provider: z.string(),
  providerId: z.string(),
  refreshToken: z.string(),
});

export type UserRegisterRequestGoogle = z.infer<typeof UserRegisterRequestGoogleSchema>

export const UserIdSchema = z.object({
  id: z.string().min(1).openapi({ example: "cmg9fye950000ug4c5wnbftqf" }) 
});
