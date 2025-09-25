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

export type UserResponseDTO = z.infer<typeof UserResponseDTOSchema>;
export const UserResponseDTOSchema = z.object({
    id: z.string().uuid().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    email: z.string().email().openapi({ example: 'thanhbinh1801@gmail.com' }),
    name: z.string().nullable().openapi({ example: 'John Doe' }),
    avatarUrl: z.string().url().nullable().openapi({ example: 'https://example.com/avatar.jpg' }),
    isActive: z.number().openapi({ example: 1 }),
    createdAt: z.string().openapi({ example: '2023-10-01T12:00:00Z' }),
    updatedAt: z.string().openapi({ example: '2023-10-01T12:00:00Z' }),
});