"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRegistry = void 0;
exports.ListRouter = ListRouter;
const express_1 = require("express");
const commons_1 = require("@/commons");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const swagger_1 = require("@/swagger");
const zod_1 = __importDefault(require("zod"));
exports.listRegistry = new zod_to_openapi_1.OpenAPIRegistry();
exports.listRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list',
    method: "get",
    tags: ["List"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string(),
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.listRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}',
    method: "get",
    tags: ["List"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string(),
            listId: zod_1.default.string(),
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.listRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list',
    method: "post",
    tags: ["List"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string(),
        }),
        body: {
            content: {
                "application/json": {
                    schema: zod_1.default.object({
                        name: zod_1.default.string(),
                    }),
                    example: {
                        nameList: "To Do",
                    },
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.listRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}',
    method: "put",
    tags: ["List"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string(),
            listId: zod_1.default.string(),
        }),
        body: {
            content: {
                "application/json": {
                    schema: zod_1.default.object({
                        name: zod_1.default.string(),
                        leftId: zod_1.default.string(),
                        rightId: zod_1.default.string()
                    }),
                    example: {
                        nameList: "In Progress",
                        leftIndex: "leftListId",
                        rightIndex: "rightListId",
                    },
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.listRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}',
    method: "delete",
    tags: ["List"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string(),
            listId: zod_1.default.string(),
        }),
        query: zod_1.default.object({
            permanent: zod_1.default.enum(['true', 'false']).optional().describe('Set to "true" for hard delete, omit or "false" for soft delete')
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
function ListRouter(listController, cardRouter) {
    const listRouter = (0, express_1.Router)({ mergeParams: true });
    listRouter.get('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.authorize)(['VIEW_LIST'], "board"), (0, commons_1.asyncHandler)(listController.getLists));
    listRouter.get('/:listId', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.authorize)(['VIEW_LIST'], "board"), (0, commons_1.asyncHandler)(listController.getListById));
    listRouter.post('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.authorize)(['CREATE_LIST'], "board"), (0, commons_1.asyncHandler)(listController.createList));
    listRouter.put('/:listId', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.authorize)(['UPDATE_LIST'], "board"), (0, commons_1.asyncHandler)(listController.updateList));
    listRouter.delete('/:listId', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.authorize)(['DELETE_LIST'], "board"), (0, commons_1.asyncHandler)(listController.deleteList));
    listRouter.use('/:listId/card', cardRouter);
    return listRouter;
}
