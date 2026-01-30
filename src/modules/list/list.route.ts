import { Router } from "express";
import { asyncHandler, authorize, authenticate } from "@/commons";
import ListController from "./list.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";

export const listRegistry = new OpenAPIRegistry();

listRegistry.registerPath({
  path: '/api/v1/list',
  method: "get",
  tags: ["List"],
  security: [{ bearerAuth: [] }],
  responses: createApiResponse(z.null(), "Success"),
});

listRegistry.registerPath({
  path: '/api/v1/list/{listId}',
  method: "get",
  tags: ["List"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      listId: z.string(),
    })
  },
  responses: createApiResponse(z.null(), "Success"),
});

listRegistry.registerPath({
  path: '/api/v1/list',
  method: "post",
  tags: ["List"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            boardId: z.string(),
            name: z.string(),
          }),
          example: {
            boardId: "boardId",
            nameList: "To Do",
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

listRegistry.registerPath({
  path: '/api/v1/list/{listId}',
  method: "put",
  tags: ["List"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      listId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            boardId: z.string(),
            name: z.string().optional(),
            position: z.number().optional(),
          }),
          example: {
            boardId: "boardId",
            nameList: "In Progress",
            position: 1000
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

listRegistry.registerPath({
  path: '/api/v1/list/{listId}',
  method: "delete",
  tags: ["List"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      listId: z.string(),
    }),
    query: z.object({
      permanent: z.enum(['true', 'false']).optional().describe('Set to "true" for hard delete, omit or "false" for soft delete')
    })
  },
  responses: createApiResponse(z.null(), "Success"),
});

export function ListRouter(
  listController: ListController,
  cardRouter: Router
): Router {
  const listRouter = Router();

  listRouter.get('/', asyncHandler(authenticate()), authorize(['VIEW_LIST'], "global"),
    asyncHandler(listController.getLists));
  listRouter.get('/:listId', asyncHandler(authenticate()), authorize(['VIEW_LIST'], "global"),
    asyncHandler(listController.getListById));
  listRouter.post('/', asyncHandler(authenticate()), authorize(['CREATE_LIST'], "global"),
    asyncHandler(listController.createList));
  listRouter.put('/:listId', asyncHandler(authenticate()), authorize(['UPDATE_LIST'], "global"),
    asyncHandler(listController.updateList));
  listRouter.delete('/:listId', asyncHandler(authenticate()), authorize(['DELETE_LIST'], "global"),
    asyncHandler(listController.deleteList));

  listRouter.use('/:listId/card', cardRouter);

  return listRouter;
}