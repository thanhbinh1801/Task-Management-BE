import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export type LoginResponse = z.infer<typeof LoginSchema>;
export const LoginSchema = z.object({
    email: z.string().email().openapi({ example: 'thanhbinh1801@gmail.com' }),
    password: z.string().min(6).openapi({ example: 'password123' }),
});

export type RegisterResponse = z.infer<typeof RegisterSchema>;
export const RegisterSchema = z.object({
    email: z.string().email().openapi({ example: 'thanhbinh1801@gmail.com' }),
    password: z.string().min(6).openapi({ example: 'password123' }),
    name: z.string().min(2).max(100).nullable().openapi({ example: 'Thanh Binh' }).optional(),
    avatarUrl: z.string().url().nullable().openapi({ example: 'https://example.com/avatar.jpg' }).optional(),
});

