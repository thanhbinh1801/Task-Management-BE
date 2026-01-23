import { Router } from "express";
import { asyncHandler, authenticate, authorize, BadRequestException } from "@/commons";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";
import { ChecklistController } from "./checklist.controller";
import { ChecklistService } from "./checklist.service";
import { ChecklistCreateRequestSchema, ChecklistItemCreateRequestSchema, ChecklistItemUpdateRequestSchema } from "./dtos/requests/checklist.request";
import {
  GetChecklistsResponseSchema,
  CreateChecklistResponseSchema,
  CreateChecklistItemResponseSchema,
  UpdateChecklistItemResponseSchema,
  DeleteResponseSchema,
} from "./dtos/responses/checklist.response";

export const checklistRegistry = new OpenAPIRegistry();

checklistRegistry.registerPath({
  path: "/api/v1/card/{cardId}/checklist",
  method: "get",
  tags: ["Checklist"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string().describe("ID của card"),
    }),
  },
  responses: createApiResponse(
    GetChecklistsResponseSchema,
    "Get all checklists of a card"
  ),
});

checklistRegistry.registerPath({
  path: "/api/v1/card/{cardId}/checklist",
  method: "post",
  tags: ["Checklist"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string().describe("ID của card"),
    }),
    body: {
      content: {
        "application/json": {
          schema: ChecklistCreateRequestSchema,
        },
      },
    },
  },
  responses: createApiResponse(
    CreateChecklistResponseSchema,
    "Create a new checklist"
  ),
});

checklistRegistry.registerPath({
  path: "/api/v1/card/{cardId}/checklist/{checklistId}",
  method: "delete",
  tags: ["Checklist"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string().describe("ID của card"),
      checklistId: z.string().describe("ID của checklist"),
    }),
  },
  responses: createApiResponse(
    DeleteResponseSchema,
    "Delete a checklist"
  ),
});

checklistRegistry.registerPath({
  path: "/api/v1/card/{cardId}/checklist/{checklistId}/item",
  method: "post",
  tags: ["Checklist"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string().describe("ID của card"),
      checklistId: z.string().describe("ID của checklist"),
    }),
    body: {
      content: {
        "application/json": {
          schema: ChecklistItemCreateRequestSchema,
        },
      },
    },
  },
  responses: createApiResponse(
    CreateChecklistItemResponseSchema,
    "Create a new checklist item"
  ),
});

checklistRegistry.registerPath({
  path: "/api/v1/card/{cardId}/checklist/{checklistId}/item/{itemId}",
  method: "put",
  tags: ["Checklist"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string().describe("ID của card"),
      checklistId: z.string().describe("ID của checklist"),
      itemId: z.string().describe("ID của checklist item"),
    }),
    body: {
      content: {
        "application/json": {
          schema: ChecklistItemUpdateRequestSchema,
        },
      },
    },
  },
  responses: createApiResponse(
    UpdateChecklistItemResponseSchema,
    "Update a checklist item"
  ),
});

checklistRegistry.registerPath({
  path: "/api/v1/card/{cardId}/checklist/{checklistId}/item/{itemId}",
  method: "delete",
  tags: ["Checklist"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string().describe("ID của card"),
      checklistId: z.string().describe("ID của checklist"),
      itemId: z.string().describe("ID của checklist item"),
    }),
  },
  responses: createApiResponse(
    DeleteResponseSchema,
    "Delete a checklist item"
  ),
});

export function initChecklistRouter(): Router {
  const checklistService = new ChecklistService();
  const checklistController = new ChecklistController();
  const router = Router({ mergeParams: true });

  const attachBoardId = asyncHandler(async (req, _res, next) => {
    const cardId = req.params.cardId;
    if (!cardId) {
      throw new BadRequestException("cardId not found");
    }
    const card = await checklistService.ensureCard(cardId as string);
    req.params.boardId = card.boardId;
    return next();
  });

  router.get(
    "/:cardId/checklist",
    asyncHandler(authenticate()),
    attachBoardId,
    authorize(["VIEW_CARD"], "board"),
    asyncHandler(checklistController.getChecklistsByCard)
  );

  router.post(
    "/:cardId/checklist",
    asyncHandler(authenticate()),
    attachBoardId,
    authorize(["UPDATE_CARD"], "board"),
    asyncHandler(checklistController.createChecklist)
  );

  router.delete(
    "/:cardId/checklist/:checklistId",
    asyncHandler(authenticate()),
    attachBoardId,
    authorize(["UPDATE_CARD"], "board"),
    asyncHandler(checklistController.deleteChecklist)
  );

  router.post(
    "/:cardId/checklist/:checklistId/item",
    asyncHandler(authenticate()),
    attachBoardId,
    authorize(["UPDATE_CARD"], "board"),
    asyncHandler(checklistController.createChecklistItem)
  );

  router.put(
    "/:cardId/checklist/:checklistId/item/:itemId",
    asyncHandler(authenticate()),
    attachBoardId,
    authorize(["UPDATE_CARD"], "board"),
    asyncHandler(checklistController.updateChecklistItem)
  );

  router.delete(
    "/:cardId/checklist/:checklistId/item/:itemId",
    asyncHandler(authenticate()),
    attachBoardId,
    authorize(["UPDATE_CARD"], "board"),
    asyncHandler(checklistController.deleteChecklistItem)
  );

  return router;
}
