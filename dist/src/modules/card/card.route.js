"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRegistry = void 0;
exports.CardRouter = CardRouter;
const express_1 = require("express");
const commons_1 = require("@/commons");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const swagger_1 = require("@/swagger");
const zod_1 = __importDefault(require("zod"));
exports.cardRegistry = new zod_to_openapi_1.OpenAPIRegistry();
exports.cardRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}/card',
    method: "get",
    tags: ["Card"],
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
exports.cardRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}/card/{cardId}',
    method: "get",
    tags: ["Card"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string(),
            listId: zod_1.default.string(),
            cardId: zod_1.default.string(),
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.cardRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}/card',
    method: "post",
    tags: ["Card"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string(),
            listId: zod_1.default.string()
        }),
        body: {
            content: {
                "application/json": {
                    schema: zod_1.default.object({
                        name: zod_1.default.string(),
                    }),
                    example: {
                        nameCard: "Card 1",
                    },
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.cardRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}/card/{cardId}',
    method: "put",
    tags: ["Card"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string(),
            listId: zod_1.default.string(),
            cardId: zod_1.default.string(),
        }),
        body: {
            content: {
                "application/json": {
                    schema: zod_1.default.object({
                        name: zod_1.default.string(),
                    }),
                    example: {
                        nameCard: "Card 1 Updated",
                    },
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.cardRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}/card/{cardId}',
    method: "delete",
    tags: ["Card"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string(),
            boardId: zod_1.default.string(),
            listId: zod_1.default.string(),
            cardId: zod_1.default.string(),
        }),
        query: zod_1.default.object({
            permanent: zod_1.default.enum(['true', 'false']).optional().describe('Set to "true" for hard delete, omit or "false" for soft delete')
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
function CardRouter(cardController) {
    const cardRouter = (0, express_1.Router)({ mergeParams: true });
    cardRouter.get('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.authorize)(['VIEW_CARD'], "board"), (0, commons_1.asyncHandler)(cardController.getCards));
    cardRouter.get('/:cardId', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.authorize)(['VIEW_CARD'], "board"), (0, commons_1.asyncHandler)(cardController.getCardById));
    cardRouter.post('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.authorize)(['CREATE_CARD'], "board"), (0, commons_1.asyncHandler)(cardController.createCard));
    cardRouter.put('/:cardId', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.authorize)(['UPDATE_CARD'], "board"), (0, commons_1.asyncHandler)(cardController.updateCard));
    cardRouter.delete('/:cardId', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.authorize)(['DELETE_CARD'], "board"), (0, commons_1.asyncHandler)(cardController.deleteCard));
    return cardRouter;
}
