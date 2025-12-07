"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdSchema = exports.UserRegisterRequestGoogleSchema = exports.UserRegisterRequestSchema = exports.UserUpdateRequestSchema = exports.UserRequestSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
exports.UserRequestSchema = zod_1.default.object({
    skip: zod_1.default.number().int(),
    take: zod_1.default.number().int(),
    name: zod_1.default.string().optional(),
    email: zod_1.default.string().optional()
});
exports.UserUpdateRequestSchema = zod_1.default.object({
    id: zod_1.default.string().cuid(),
    name: zod_1.default.string().optional(),
    email: zod_1.default.string().optional(),
    status: zod_1.default.enum(client_1.UserStatusEnum).default(client_1.UserStatusEnum.ACTIVE).optional(),
    // avatarUrl: z.string().optional(),
    emailVerifiedAt: zod_1.default.date().optional().transform((val) => (val !== undefined ? new Date() : undefined))
});
exports.UserRegisterRequestSchema = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string(),
    status: zod_1.default.nativeEnum(client_1.UserStatusEnum).default(client_1.UserStatusEnum.ACTIVE),
    avatarUrl: zod_1.default.string().default("https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"),
    passwordHash: zod_1.default.string()
});
exports.UserRegisterRequestGoogleSchema = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string(),
    status: zod_1.default.nativeEnum(client_1.UserStatusEnum).default(client_1.UserStatusEnum.ACTIVE),
    avatarUrl: zod_1.default.string().url().default("https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"),
    provider: zod_1.default.string(),
    providerId: zod_1.default.string(),
    refreshToken: zod_1.default.string(),
});
exports.UserIdSchema = zod_1.default.object({
    id: zod_1.default.string().min(1).openapi({ example: "cmg9fye950000ug4c5wnbftqf" })
});
