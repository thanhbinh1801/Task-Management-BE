"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardRegistry = void 0;
exports.BoardRouter = BoardRouter;
const express_1 = require("express");
const commons_1 = require("@/commons");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const swagger_1 = require("@/swagger");
const zod_1 = __importDefault(require("zod"));
const board_request_1 = require("./dtos/requests/board.request");
const commons_2 = require("@/commons");
exports.boardRegistry = new zod_to_openapi_1.OpenAPIRegistry();
exports.boardRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board',
    method: "get",
    tags: ["Board"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string()
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.boardRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}',
    method: "get",
    tags: ["Board"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string()
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.boardRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board',
    method: "post",
    tags: ["Board"],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: board_request_1.BoardCreateRequestSchema,
                    example: {
                        nameBoard: "Thanh Binh Board1",
                    },
                },
            },
        },
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
        }),
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.boardRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}',
    method: "put",
    tags: ["Board"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string()
        }),
        body: {
            content: {
                "application/json": {
                    schema: board_request_1.BoardUpdateRequestSchema,
                    example: {
                        nameBoard: "Board11",
                    },
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.boardRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}',
    method: "delete",
    tags: ["Board"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string()
        }),
        query: zod_1.default.object({
            permanent: zod_1.default.enum(['true', 'false']).optional().describe('Set to "true" for hard delete, omit or "false" for soft delete')
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
function BoardRouter(boardController, memberBoardRouter, boardJoinLinkRouter, listRouter) {
    const boardRouter = (0, express_1.Router)({ mergeParams: true });
    boardRouter.get('/', (0, commons_1.asyncHandler)((0, commons_2.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['VIEW_BOARD'], "workspace")), (0, commons_1.asyncHandler)(boardController.getBoards));
    boardRouter.get('/:boardId', (0, commons_1.asyncHandler)((0, commons_2.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['VIEW_BOARD'], "board")), (0, commons_1.asyncHandler)(boardController.getBoardById));
    boardRouter.post('/', (0, commons_1.asyncHandler)((0, commons_2.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['CREATE_BOARD'], "workspace")), (0, commons_1.asyncHandler)(boardController.createBoard));
    boardRouter.put('/:boardId', (0, commons_1.asyncHandler)((0, commons_2.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['UPDATE_BOARD'], "board")), (0, commons_1.asyncHandler)(boardController.updateBoard));
    boardRouter.delete('/:boardId', (0, commons_1.asyncHandler)((0, commons_2.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['DELETE_BOARD'], "board")), (0, commons_1.asyncHandler)(boardController.deleteBoard));
    boardRouter.use("/:boardId/board-join-link", boardJoinLinkRouter);
    boardRouter.use("/:boardId/member-board", memberBoardRouter);
    boardRouter.use("/:boardId/list", listRouter);
    return boardRouter;
}
