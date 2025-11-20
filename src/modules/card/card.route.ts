import { Router } from "express";
import { asyncHandler, authorize, authenticate } from "@/commons";
import CardController from "./card.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";

export const cardRegistry = new OpenAPIRegistry();

cardRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}/card',
  method: "get",
  tags: ["Card"],
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

cardRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}/card/{cardId}',
  method: "get",
  tags: ["Card"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string(),
      boardId: z.string(),
      listId: z.string(),
      cardId: z.string(),
    })
  },
  responses: createApiResponse(z.null(), "Success"),
});

cardRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}/card',
  method: "post",
  tags: ["Card"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string(),
      boardId: z.string(),
      listId: z.string()
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string(),
          }),
          example: {
            nameCard: "Card 1",
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

cardRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}/card/{cardId}',
  method: "put",
  tags: ["Card"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string(),
      boardId: z.string(),
      listId: z.string(),
      cardId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string(),
          }),
          example: {
            nameCard: "Card 1 Updated",
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

cardRegistry.registerPath({
  path: '/api/v1/workspace/{workspaceId}/board/{boardId}/list/{listId}/card/{cardId}',
  method: "delete",
  tags: ["Card"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      workspaceId: z.string(),
      boardId: z.string(),
      listId: z.string(),
      cardId: z.string(),
    }),
    query: z.object({
      permanent: z.enum(['true', 'false']).optional().describe('Set to "true" for hard delete, omit or "false" for soft delete')
    })
  },
  responses: createApiResponse(z.null(), "Success"),
});

export function CardRouter( 
  cardController: CardController, ) : Router 
  {
  const cardRouter = Router({ mergeParams: true });

  cardRouter.get('/', asyncHandler(authenticate()), authorize(['VIEW_CARD'], "board"),
                      asyncHandler(cardController.getCards));
  cardRouter.get('/:cardId', asyncHandler(authenticate()), authorize(['VIEW_CARD'], "board"),
                      asyncHandler(cardController.getCardById));
  cardRouter.post('/', asyncHandler(authenticate()), authorize(['CREATE_CARD'], "board"),
                      asyncHandler(cardController.createCard));
  cardRouter.put('/:cardId', asyncHandler(authenticate()), authorize(['UPDATE_CARD'], "board"),
                      asyncHandler(cardController.updateCard));
  cardRouter.delete('/:cardId', asyncHandler(authenticate()), authorize(['DELETE_CARD'], "board"),
                      asyncHandler(cardController.deleteCard));

  return cardRouter;
}