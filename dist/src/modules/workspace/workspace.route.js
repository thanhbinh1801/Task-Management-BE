"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceRegistry = void 0;
exports.WorkspaceRouter = WorkspaceRouter;
const express_1 = require("express");
const commons_1 = require("@/commons");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const swagger_1 = require("@/swagger");
const zod_1 = __importDefault(require("zod"));
const workspace_request_1 = require("./dtos/requests/workspace.request");
const client_1 = require("@prisma/client");
exports.workspaceRegistry = new zod_to_openapi_1.OpenAPIRegistry();
exports.workspaceRegistry.registerPath({
    path: '/api/v1/workspace',
    method: "get",
    tags: ["Workspace"],
    security: [{ bearerAuth: [] }],
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.workspaceRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}',
    method: "get",
    tags: ["Workspace"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string()
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.workspaceRegistry.registerPath({
    path: '/api/v1/workspace/',
    method: "post",
    tags: ["Workspace"],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: workspace_request_1.WorkspaceCreateRequestSchema,
                    example: {
                        name: "Thanh Binh Workspace",
                        visibility: client_1.WorkspaceStatusEnum.PUBLIC,
                    },
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.workspaceRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}',
    method: "put",
    tags: ["Workspace"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string()
        }),
        body: {
            content: {
                "application/json": {
                    schema: workspace_request_1.WorkspaceUpdateRequestSchema,
                    example: {
                        name: "Thanh Tung Workspace",
                        visibility: client_1.WorkspaceStatusEnum.PUBLIC
                    },
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.workspaceRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}',
    method: "delete",
    tags: ["Workspace"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string()
        }),
        query: zod_1.default.object({
            permanent: zod_1.default.enum(['true', 'false']).optional().describe('Set to "true" for hard delete, omit or "false" for soft delete')
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
function WorkspaceRouter(workspaceController, workspaceJoinLinkRouter, memberWorkspaceRouter, boardRouter) {
    const workspaceRouter = (0, express_1.Router)();
    workspaceRouter.get('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['VIEW_WORKSPACE'], "global")), (0, commons_1.asyncHandler)(workspaceController.getWorkspaces));
    workspaceRouter.get('/:workspaceId', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['VIEW_WORKSPACE'], "workspace")), (0, commons_1.asyncHandler)(workspaceController.getWorkspaceById));
    workspaceRouter.post('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['CREATE_WORKSPACE'], "global")), (0, commons_1.asyncHandler)(workspaceController.createWorkspace));
    workspaceRouter.put('/:workspaceId', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['UPDATE_WORKSPACE'], "workspace")), (0, commons_1.asyncHandler)(workspaceController.updateWorkspace));
    workspaceRouter.delete('/:workspaceId', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['DELETE_WORKSPACE'], "workspace")), (0, commons_1.asyncHandler)(workspaceController.deleteWorkspace));
    workspaceRouter.use("/:workspaceId/board", boardRouter);
    workspaceRouter.use("/:workspaceId/link", workspaceJoinLinkRouter);
    workspaceRouter.use("/:workspaceId/members", memberWorkspaceRouter);
    return workspaceRouter;
}
