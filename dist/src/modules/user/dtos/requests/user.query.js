"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.GetUserQuerySchema = zod_1.default.object({
    page: zod_1.default.coerce.number().int().default(1).openapi({
        description: "Page number",
        example: 1
    }),
    limit: zod_1.default.coerce.number().int().default(10).openapi({
        description: "Items per page",
        example: 10
    }),
    name: zod_1.default.string().optional().openapi({
        description: " Filter by name",
        example: "binh"
    }),
    email: zod_1.default.string().optional().openapi({
        description: "Filter by email",
        example: "thanhbinhnkd@gmail.com"
    })
});
