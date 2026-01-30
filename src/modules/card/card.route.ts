import { Router } from "express";
import { asyncHandler, authorize, authenticate } from "@/commons";
import CardController from "./card.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";

export const cardRegistry = new OpenAPIRegistry();

cardRegistry.registerPath({
  path: '/api/v1/list/{listId}/card',
  method: "get",
  tags: ["Card"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      listId: z.string(),
    })
  },
  responses: createApiResponse(z.null(), "Success"),
});

cardRegistry.registerPath({
  path: '/api/v1/list/{listId}/card/{cardId}',
  method: "get",
  tags: ["Card"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      listId: z.string(),
      cardId: z.string(),
    })
  },
  responses: createApiResponse(z.null(), "Success"),
});

cardRegistry.registerPath({
  path: '/api/v1/list/{listId}/card',
  method: "post",
  tags: ["Card"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      listId: z.string()
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            boardId: z.string(),
            name: z.string(),
          }),
          example: {
            boardId: "boardId",
            nameCard: "Card 1",
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

cardRegistry.registerPath({
  path: '/api/v1/list/{listId}/card/{cardId}',
  method: "put",
  tags: ["Card"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      listId: z.string(),
      cardId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            boardId: z.string(),
            name: z.string(),
            listIdTarget: z.string(),
            position: z.number(),
          }),
          example: {
            boardId: "boardId",
            nameCard: "Card 1 Updated",
            listIdTarget: "listIdTarget",
            position: 1000,
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

cardRegistry.registerPath({
  path: '/api/v1/list/{listId}/card/{cardId}',
  method: "delete",
  tags: ["Card"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
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
  cardController: CardController,
  cardMemberRouter: Router,
  cardLabelRouter: Router,
  checklistRouter: Router,
): Router {
  const cardRouter = Router({ mergeParams: true });

  cardRouter.get('/', asyncHandler(authenticate()), authorize(['VIEW_CARD'], "global"),
    asyncHandler(cardController.getCards));
  cardRouter.get('/:cardId', asyncHandler(authenticate()), authorize(['VIEW_CARD'], "global"),
    asyncHandler(cardController.getCardById));
  cardRouter.post('/', asyncHandler(authenticate()), authorize(['CREATE_CARD'], "global"),
    asyncHandler(cardController.createCard));
  cardRouter.put('/:cardId', asyncHandler(authenticate()), authorize(['UPDATE_CARD'], "global"),
    asyncHandler(cardController.updateCard));
  cardRouter.delete('/:cardId', asyncHandler(authenticate()), authorize(['DELETE_CARD'], "global"),
    asyncHandler(cardController.deleteCard));

  cardRouter.use("/:cardId/member", cardMemberRouter);
  cardRouter.use("/:cardId/label", cardLabelRouter);
  cardRouter.use("/:cardId/checklist", checklistRouter);
  return cardRouter;
}