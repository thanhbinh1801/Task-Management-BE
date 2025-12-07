"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceJoinLinkRegistry = void 0;
exports.WorkspaceJoinLinkRouter = WorkspaceJoinLinkRouter;
const express_1 = require("express");
const commons_1 = require("@/commons");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const swagger_1 = require("@/swagger");
const zod_1 = __importDefault(require("zod"));
exports.workspaceJoinLinkRegistry = new zod_to_openapi_1.OpenAPIRegistry();
exports.workspaceJoinLinkRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/link',
    method: "post",
    tags: ["Workspace-Join-Link"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            workspaceId: zod_1.default.string()
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
exports.workspaceJoinLinkRegistry.registerPath({
    path: '/api/v1/workspace/{workspaceId}/link/{linkId}/revoke',
    method: "post",
    tags: ["Workspace-Join-Link"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            linkId: zod_1.default.string()
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
function WorkspaceJoinLinkRouter(workspaceJoinLinkController) {
    const workspaceJoinLinkRouter = (0, express_1.Router)({ mergeParams: true });
    workspaceJoinLinkRouter.post('/', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['MANAGE_JOIN_LINK'], "workspace")), (0, commons_1.asyncHandler)(workspaceJoinLinkController.createLink));
    workspaceJoinLinkRouter.post('/:linkId/revoke', (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)((0, commons_1.authorize)(['MANAGE_JOIN_LINK'], "workspace")), (0, commons_1.asyncHandler)(workspaceJoinLinkController.revokeLink));
    return workspaceJoinLinkRouter;
}
