"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberWorkspaceRegistry = void 0;
exports.MemberWorkspaceRouter = MemberWorkspaceRouter;
const express_1 = require("express");
const commons_1 = require("@/commons");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const swagger_1 = require("@/swagger");
const zod_1 = __importDefault(require("zod"));
exports.memberWorkspaceRegistry = new zod_to_openapi_1.OpenAPIRegistry();
exports.memberWorkspaceRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/members',
    method: "get",
    tags: ["Workspace-Members"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string()
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.memberWorkspaceRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/members',
    method: "post",
    tags: ["Workspace-Members"],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: zod_1.default.object({ emailUser: zod_1.default.email() }),
                    example: {
                        emailUser: "chauthanhbinh181@gmail.com",
                    },
                },
            },
        },
        params: zod_1.default.object({
            workspaceId: zod_1.default.string()
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.memberWorkspaceRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/members',
    method: "put",
    tags: ["Workspace-Members"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string()
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.memberWorkspaceRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/members',
    method: "delete",
    tags: ["Workspace-Members"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string()
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
function MemberWorkspaceRouter(memberController) {
    const memberWorkspaceRouter = (0, express_1.Router)({ mergeParams: true });
    memberWorkspaceRouter.post('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['ADD_MEMBER'], "workspace")), (0, commons_1.asyncHandler)(memberController.addMemberWorkspaceByEmail));
    memberWorkspaceRouter.get('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['VIEW_MEMBER'], "workspace")), (0, commons_1.asyncHandler)(memberController.viewMemberWorkspace));
    memberWorkspaceRouter.put('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['CHANGE_MEMBER_PERMISSION'], "workspace")), (0, commons_1.asyncHandler)(memberController.changePermissionMemberWorkspace));
    memberWorkspaceRouter.delete('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['REMOVE_MEMBER'], "workspace")), (0, commons_1.asyncHandler)(memberController.removeMemberWorkspace));
    return memberWorkspaceRouter;
}
