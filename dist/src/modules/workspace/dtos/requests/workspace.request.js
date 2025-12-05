"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceUpdateRequestSchema = exports.WorkspaceCreateRequestSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.WorkspaceCreateRequestSchema = zod_1.default.object({
    name: zod_1.default.string(),
    visibility: zod_1.default.enum(client_1.WorkspaceStatusEnum).default(client_1.WorkspaceStatusEnum.PUBLIC).optional()
});
exports.WorkspaceUpdateRequestSchema = zod_1.default.object({
    name: zod_1.default.string(),
    visibility: zod_1.default.enum(client_1.WorkspaceStatusEnum).optional()
});
