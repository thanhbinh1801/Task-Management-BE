"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email().openapi({ example: 'thanhbinh1801@gmail.com' }),
    password: zod_1.z.string().min(6).openapi({ example: 'password123' }),
});
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email().openapi({ example: 'thanhbinh1801@gmail.com' }),
    password: zod_1.z.string().min(6).openapi({ example: 'password123' }),
    name: zod_1.z.string().min(2).max(100).nullable().openapi({ example: 'Thanh Binh' }).optional(),
});
