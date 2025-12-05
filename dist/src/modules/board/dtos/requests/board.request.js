"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardUpdateRequestSchema = exports.BoardCreateRequestSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.BoardCreateRequestSchema = zod_1.default.object({
    nameBoard: zod_1.default.string(),
});
exports.BoardUpdateRequestSchema = zod_1.default.object({
    boardId: zod_1.default.string(),
    workspaceId: zod_1.default.string(),
    nameBoard: zod_1.default.string()
});
