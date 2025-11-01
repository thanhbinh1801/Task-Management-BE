import { Router } from "express";
import { asyncHandler, authenticate, authorize } from "@/commons";
import WorkspaceJoinLinkController from "./workspaceJoinLink.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";

export const workspaceJoinLinkRegistry = new OpenAPIRegistry();

workspaceJoinLinkRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/link',
  method: "post",
  tags: ["Workspace-Join-Link"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

workspaceJoinLinkRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/link/{linkId}/revoke',
  method: "post",
  tags: ["Workspace-Join-Link"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      linkId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

export function WorkspaceJoinLinkRouter( workspaceJoinLinkController : WorkspaceJoinLinkController) : Router {
  const workspaceJoinLinkRouter = Router({ mergeParams: true});

  workspaceJoinLinkRouter.post('/', asyncHandler(authenticate()), asyncHandler(authorize(['MANAGE_JOIN_LINK'], "workspace")), 
                                    asyncHandler(workspaceJoinLinkController.createLink));
  workspaceJoinLinkRouter.post('/:linkId/revoke', asyncHandler(authenticate()), asyncHandler(authorize(['MANAGE_JOIN_LINK'], "workspace")), 
                                    asyncHandler(workspaceJoinLinkController.revokeLink));

  return workspaceJoinLinkRouter;
}
