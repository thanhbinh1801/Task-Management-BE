import { Router } from "express";
import { asyncHandler, authorize, authenticate } from "@/commons";
import ListController from "./list.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";

export const listRegistry = new OpenAPIRegistry();

listRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list',
  method: "get",
  tags: ["List"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string(),
      boardId: z.string(),
    })
  },
  responses: createApiResponse(z.null(), "Success"),
});

listRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}',
  method: "get",
  tags: ["List"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string(),
      boardId: z.string(),
      listId: z.string(),
    })
  },
  responses: createApiResponse(z.null(), "Success"),
});

listRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list',
  method: "post",
  tags: ["List"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string(),
      boardId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string(),
          }),
          example: {
            nameList: "To Do",
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

listRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}',
  method: "put",
  tags: ["List"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string(),
      boardId: z.string(),
      listId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string(),
            leftId: z.string(),
            rightId: z.string()
          }),
          example: {
            nameList: "In Progress",
            leftIndex: "leftListId",
            rightIndex: "rightListId",
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

listRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}',
  method: "delete",
  tags: ["List"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string(),
      boardId: z.string(),
      listId: z.string(),
    })
  },
  responses: createApiResponse(z.null(), "Success"),
});

export function ListRouter( 
  listController: ListController, 
  cardRouter: Router
) : Router 
  {
  const listRouter = Router({ mergeParams: true });

  listRouter.get('/', asyncHandler(authenticate()), authorize(['VIEW_LIST'], "board"),
                      asyncHandler(listController.getLists));
  listRouter.get('/:listId', asyncHandler(authenticate()), authorize(['VIEW_LIST'], "board"),
                      asyncHandler(listController.getListById));
  listRouter.post('/', asyncHandler(authenticate()), authorize(['CREATE_LIST'], "board"),
                      asyncHandler(listController.createList));
  listRouter.put('/:listId', asyncHandler(authenticate()), authorize(['UPDATE_LIST'], "board"),
                      asyncHandler(listController.updateList));
  listRouter.delete('/:listId', asyncHandler(authenticate()), authorize(['DELETE_LIST'], "board"),
                      asyncHandler(listController.deleteList));

  listRouter.use('/:listId/card', cardRouter);
  
  return listRouter;
}