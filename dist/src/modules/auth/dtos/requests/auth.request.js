"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
exports.LoginSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
exports.RegisterSchema = zod_1.default.object({
    email: zod_1.default.email(),
    password: zod_1.default.string().min(6),
    name: zod_1.default.string().min(2).max(100).optional(),
    status: zod_1.default.nativeEnum(client_1.UserStatusEnum).default(client_1.UserStatusEnum.ACTIVE).optional(),
    avatarUrl: zod_1.default.string().url().default("https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg").optional(),
});
