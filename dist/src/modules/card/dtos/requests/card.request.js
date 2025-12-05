"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardUpdateRequestSchema = exports.CardCreateRequestSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CardCreateRequestSchema = zod_1.default.object({
    nameCard: zod_1.default.string(),
});
exports.CardUpdateRequestSchema = zod_1.default.object({
    cardId: zod_1.default.string(),
    boardId: zod_1.default.string(),
    nameCard: zod_1.default.string(),
});
