"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPaginationResponseSchema = exports.UserResponseSchema = exports.PaginationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
exports.PaginationSchema = zod_1.default.object({
    page: zod_1.default.number(),
    limit: zod_1.default.number(),
    totalItems: zod_1.default.number(),
    totalPages: zod_1.default.number()
});
exports.UserResponseSchema = zod_1.default.object({
    id: zod_1.default.string().cuid(),
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    status: zod_1.default.nativeEnum(client_1.UserStatusEnum).default(client_1.UserStatusEnum.ACTIVE),
    avatarUrl: zod_1.default.string().optional(),
    avatarPublicId: zod_1.default.string().nullable().optional(),
});
exports.UserPaginationResponseSchema = zod_1.default.object({
    data: zod_1.default.array(exports.UserResponseSchema),
    meta: exports.PaginationSchema
});
