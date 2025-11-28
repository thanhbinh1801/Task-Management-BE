import { Router } from "express";
import { asyncHandler, authenticate, authorize } from "@/commons";
import MemberWorkspaceController from "./member.workspace.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";

export const memberWorkspaceRegistry = new OpenAPIRegistry();

memberWorkspaceRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/members',
  method: "get",
  tags: ["Workspace-Members"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

memberWorkspaceRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/members',
  method: "post",
  tags: ["Workspace-Members"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ emailUser: z.email() }),
          example: {
            emailUser: "chauthanhbinh181@gmail.com",
          },
        },
      },
    },
    params: z.object({
      workspaceId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

memberWorkspaceRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/members',
  method: "put",
  tags: ["Workspace-Members"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

memberWorkspaceRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/members',
  method: "delete",
  tags: ["Workspace-Members"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

export function MemberWorkspaceRouter (memberController: MemberWorkspaceController) : Router  { 
  const memberWorkspaceRouter = Router({ mergeParams: true});

  memberWorkspaceRouter.post('/', asyncHandler(authenticate()), asyncHandler(authorize(['ADD_MEMBER'], "workspace")),
                        asyncHandler(memberController.addMemberWorkspaceByEmail));
  memberWorkspaceRouter.get('/', asyncHandler(authenticate()), asyncHandler(authorize(['VIEW_MEMBER'], "workspace")),
                        asyncHandler(memberController.viewMemberWorkspace));
  memberWorkspaceRouter.put('/', asyncHandler(authenticate()), asyncHandler(authorize(['CHANGE_MEMBER_PERMISSION'], "workspace")),
                        asyncHandler(memberController.changePermissionMemberWorkspace));
  memberWorkspaceRouter.delete('/', asyncHandler(authenticate()), asyncHandler(authorize(['REMOVE_MEMBER'], "workspace")),
                        asyncHandler(memberController.removeMemberWorkspace));
  return memberWorkspaceRouter;  
}