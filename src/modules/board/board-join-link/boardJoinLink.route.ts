import { Router } from "express";
import { asyncHandler, authenticate, authorize } from "@/commons";
import BoardJoinLinkController from "./boardJoinLink.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";

export const boardJoinLinkRegistry = new OpenAPIRegistry();

boardJoinLinkRegistry.registerPath({
  path: '/api/v1/board/{boardId}/board-join-link',
  method: "post",
  tags: ["Board Join Link"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      boardId: z.string(),
      userId: z.string(),
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

boardJoinLinkRegistry.registerPath({
  path: '/api/v1/board/{boardId}/board-join-link/{linkId}',
  method: "delete",
  tags: ["Board Join Link"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      linkId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

export function BoardJoinLinkRouter( boardJoinLinkController : BoardJoinLinkController) : Router {
  const boardJoinLinkRouter = Router({ mergeParams: true});

  boardJoinLinkRouter.post('/', asyncHandler(authenticate()), asyncHandler(authorize(['MANAGE_JOIN_LINK'], "board")), 
                                    asyncHandler(boardJoinLinkController.createLink));
  boardJoinLinkRouter.post('/:linkId/revoke', asyncHandler(authenticate()), asyncHandler(authorize(['MANAGE_JOIN_LINK'], "workspace")), 
                                    asyncHandler(boardJoinLinkController.revokeLink));

    return boardJoinLinkRouter;
  }
