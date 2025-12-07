"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUpdateRequestSchema = exports.ListCreateRequestSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.ListCreateRequestSchema = zod_1.default.object({
    nameList: zod_1.default.string(),
});
exports.ListUpdateRequestSchema = zod_1.default.object({
    listId: zod_1.default.string(),
    boardId: zod_1.default.string(),
    nameList: zod_1.default.string(),
    leftId: zod_1.default.string().optional(),
    rightId: zod_1.default.string().optional(),
});
