import { Router } from "express";
import { asyncHandler, authenticate , authorize} from "@/commons";
import WorkspaceController from "./workspace.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";
import { WorkspaceCreateRequestSchema, WorkspaceUpdateRequestSchema } from './dtos/requests/workspace.request';
import { WorkspaceStatusEnum } from "@prisma/client";

export const workspaceRegistry = new OpenAPIRegistry();

workspaceRegistry.registerPath({
  path: '/api/v1/workspace',
  method: "get",
  tags: ["Workspace"],
  security: [{ bearerAuth: [] }],
  responses: createApiResponse(z.null() , "Success"),
});

workspaceRegistry.registerPath({
  path: '/api/v1/workspace/{id}',
  method: "get",
  tags: ["Workspace"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

workspaceRegistry.registerPath({
  path: '/api/v1/workspace/',
  method: "post",
  tags: ["Workspace"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: WorkspaceCreateRequestSchema,
          example: {
            name: "Thanh Binh Workspace",
            visibility: WorkspaceStatusEnum.PUBLIC,
            // userId: "cmgnmi9e90000ugtgblicw0hz"
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null() , "Success"),
});

workspaceRegistry.registerPath({
  path: '/api/v1/workspace/{id}',
  method: "put",
  tags: ["Workspace"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string()
    }),
     body: {
      content: {
        "application/json": {
          schema: WorkspaceUpdateRequestSchema, 
          example: {
            name: "Thanh Tung Workspace",
            visibility: WorkspaceStatusEnum.PUBLIC
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null() , "Success"),
});

workspaceRegistry.registerPath({
  path: '/api/v1/workspace/{id}',
  method: "delete",
  tags: ["Workspace"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

export function WorkspaceRouter(workspaceController: WorkspaceController, boardRouter: Router, workspaceJoinLinkRouter: Router, memberWorkspaceRouter: Router) : Router {
  const workspaceRouter = Router();

  workspaceRouter.get('/', asyncHandler(authenticate()), asyncHandler(authorize(['VIEW_WORKSPACE'], "global")), 
                        asyncHandler(workspaceController.getWorkspaces));
  workspaceRouter.get('/:workspaceId', asyncHandler(authenticate()), asyncHandler(authorize(['VIEW_WORKSPACE'], "workspace")),
                        asyncHandler(workspaceController.getWorkspaceById));
  workspaceRouter.post('/', asyncHandler(authenticate()), asyncHandler(authorize(['CREATE_WORKSPACE'], "global")), 
                        asyncHandler(workspaceController.createWorkspace));
  workspaceRouter.put('/:workspaceId', asyncHandler(authenticate()), asyncHandler(authorize(['UPDATE_WORKSPACE'], "workspace")), 
                        asyncHandler(workspaceController.updateWorkspace));
  workspaceRouter.delete('/:workspaceId', asyncHandler(authenticate()), asyncHandler(authorize(['DELETE_WORKSPACE'], "workspace")), 
                        asyncHandler(workspaceController.deleteWorkspace));                 

  workspaceRouter.use("/:workspaceId/board", boardRouter);  
  workspaceRouter.use("/:workspaceId/link", workspaceJoinLinkRouter);
  workspaceRouter.use("/:workspaceId/members", memberWorkspaceRouter);

  return workspaceRouter;
}
