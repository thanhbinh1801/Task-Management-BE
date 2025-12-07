"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberBoardRegistry = void 0;
exports.MemberBoardRouter = MemberBoardRouter;
const express_1 = require("express");
const commons_1 = require("@/commons");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const swagger_1 = require("@/swagger");
const zod_1 = __importDefault(require("zod"));
exports.memberBoardRegistry = new zod_to_openapi_1.OpenAPIRegistry();
exports.memberBoardRegistry.registerPath({
    path: '/api/v1/board/{boardId}/members',
    method: "post",
    tags: ["Member Board"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            boardId: zod_1.default.string()
        }),
        body: {
            content: {
                'application/json': {
                    schema: zod_1.default.object({
                        email: zod_1.default.string().email(),
                        boardId: zod_1.default.string(),
                    })
                }
            }
        }
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.memberBoardRegistry.registerPath({
    path: '/api/v1/board/{boardId}/members',
    method: "get",
    tags: ["Member Board"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            boardId: zod_1.default.string()
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.memberBoardRegistry.registerPath({
    path: '/api/v1/board/{boardId}/members',
    method: "put",
    tags: ["Member Board"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            boardId: zod_1.default.string()
        }),
        body: {
            content: {
                'application/json': {
                    schema: zod_1.default.object({
                        boardId: zod_1.default.string(),
                        userId: zod_1.default.string(),
                        role: zod_1.default.enum(['OwnerBoard', 'MemberBoard'])
                    })
                }
            }
        }
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.memberBoardRegistry.registerPath({
    path: '/api/v1/board/{boardId}/members',
    method: "delete",
    tags: ["Member Board"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            boardId: zod_1.default.string()
        }),
        body: {
            content: {
                'application/json': {
                    schema: zod_1.default.object({
                        userId: zod_1.default.string(),
                        boardId: zod_1.default.string()
                    })
                }
            }
        }
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
function MemberBoardRouter(memberController) {
    const memberBoardRouter = (0, express_1.Router)();
    memberBoardRouter.post('/:boardId/members', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['ADD_MEMBER'], "board")), (0, commons_1.asyncHandler)(memberController.addMemberBoardByEmail));
    memberBoardRouter.get('/:boardId/members', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['VIEW_MEMBER'], "board")), (0, commons_1.asyncHandler)(memberController.viewMemberBoard));
    memberBoardRouter.put('/:boardId/members', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['CHANGE_MEMBER_PERMISSION'], "board")), (0, commons_1.asyncHandler)(memberController.changePermissionMemberBoard));
    memberBoardRouter.delete('/:boardId/members', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['REMOVE_MEMBER'], "board")), (0, commons_1.asyncHandler)(memberController.removeMemberBoard));
    return memberBoardRouter;
}
