import z from "zod";
import { UserStatusEnum } from "@prisma/client";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type LoginResponse = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2).max(100).optional(),
  status: z.nativeEnum(UserStatusEnum).default(UserStatusEnum.ACTIVE).optional(),
  avatarUrl: z.string().url().default("https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg").optional(),
});

export type RegisterResponse = z.infer<typeof RegisterSchema>;

