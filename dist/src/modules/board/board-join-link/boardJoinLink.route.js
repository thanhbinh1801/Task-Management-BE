"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardJoinLinkRegistry = void 0;
exports.BoardJoinLinkRouter = BoardJoinLinkRouter;
const express_1 = require("express");
const commons_1 = require("@/commons");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const swagger_1 = require("@/swagger");
const zod_1 = __importDefault(require("zod"));
exports.boardJoinLinkRegistry = new zod_to_openapi_1.OpenAPIRegistry();
exports.boardJoinLinkRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/board-join-link',
    method: "post",
    tags: ["Board Join Link"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string(),
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.boardJoinLinkRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/board-join-link/{linkId}',
    method: "delete",
    tags: ["Board Join Link"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string(),
            linkId: zod_1.default.string()
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
function BoardJoinLinkRouter(boardJoinLinkController) {
    const boardJoinLinkRouter = (0, express_1.Router)({ mergeParams: true });
    boardJoinLinkRouter.post('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['MANAGE_JOIN_LINK'], "board")), (0, commons_1.asyncHandler)(boardJoinLinkController.createLink));
    boardJoinLinkRouter.post('/:linkId/revoke', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['MANAGE_JOIN_LINK'], "workspace")), (0, commons_1.asyncHandler)(boardJoinLinkController.revokeLink));
    return boardJoinLinkRouter;
}
