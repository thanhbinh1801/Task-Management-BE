import { Router } from "express";
import { asyncHandler } from "@/commons";
import BoardController from "./board.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";
import { BoardCreateRequestSchema, BoardUpdateRequestSchema } from "./dtos/requests/board.request";
import { authenticate } from "@/commons";

export const boardRegistry = new OpenAPIRegistry();

boardRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board',
  method: "get",
  tags: ["Board"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

boardRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}',
  method: "get",
  tags: ["Board"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string(),
      boardId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

boardRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board',
  method: "post",
  tags: ["Board"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: BoardCreateRequestSchema,
          example: {
            nameBoard: "Thanh Binh Board1",
          },
        },
      },
    },
    params: z.object({
      workspaceId: z.string(),
    }),
  },
  responses: createApiResponse(z.null() , "Success"),
});

boardRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}',
  method: "put",
  tags: ["Board"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string(),
      boardId: z.string()
    }),
     body: {
      content: {
        "application/json": {
          schema: BoardUpdateRequestSchema, 
          example: {
            nameBoard: "Board11",
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null() , "Success"),
});

boardRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}',
  method: "delete",
  tags: ["Board"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      boardId: z.string()
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});


export function BoardRouter( 
  boardController: BoardController, 
  memberBoardRouter: Router, 
  boardJoinLinkRouter: Router) : Router 
  {
  const boardRouter = Router({ mergeParams: true });

  boardRouter.get('/', asyncHandler(authenticate()), asyncHandler(boardController.getBoards));
  boardRouter.get('/:boardId', asyncHandler(authenticate()), asyncHandler(boardController.getBoardById));
  boardRouter.post('/', asyncHandler(authenticate()), asyncHandler(boardController.createBoard));
  boardRouter.put('/:boardId', asyncHandler(authenticate()), asyncHandler(boardController.updateBoard));
  boardRouter.delete('/:boardId', asyncHandler(authenticate()), asyncHandler(boardController.deleteBoard));

  boardRouter.use("/:boardId/board-join-link", boardJoinLinkRouter);  
  boardRouter.use("/:boardId/member-board", memberBoardRouter);

  return boardRouter;
}