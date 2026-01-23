import { asyncHandler, authenticate, authorize } from "@/commons";
import { createApiResponse } from "@/swagger";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import z from "zod";
import LabelController from "./label.controller";
import {
  CardLabelAssignRequestSchema,
  LabelCreateRequestSchema,
  LabelUpdateRequestSchema,
} from "./dtos/requests/label.request";

export const labelRegistry = new OpenAPIRegistry();

labelRegistry.registerPath({
  path: "/api/v1/board/{boardId}/label",
  method: "get",
  tags: ["Label"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      boardId: z.string(),
    }),
  },
  responses: createApiResponse(z.null(), "Success"),
});

labelRegistry.registerPath({
  path: "/api/v1/board/{boardId}/label",
  method: "post",
  tags: ["Label"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      boardId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: LabelCreateRequestSchema,
          example: {
            name: "Bug",
            color: "#FF0000",
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

labelRegistry.registerPath({
  path: "/api/v1/board/{boardId}/label/{labelId}",
  method: "put",
  tags: ["Label"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      boardId: z.string(),
      labelId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: LabelUpdateRequestSchema,
          example: {
            name: "Critical Bug",
            color: "#CC0000",
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

labelRegistry.registerPath({
  path: "/api/v1/board/{boardId}/label/{labelId}",
  method: "delete",
  tags: ["Label"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      boardId: z.string(),
      labelId: z.string(),
    }),
  },
  responses: createApiResponse(z.null(), "Success"),
});

labelRegistry.registerPath({
  path: "/api/v1/card/{cardId}/label",
  method: "get",
  tags: ["Label"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string(),
    }),
  },
  responses: createApiResponse(z.null(), "Success"),
});

labelRegistry.registerPath({
  path: "/api/v1/card/{cardId}/label",
  method: "post",
  tags: ["Label"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: CardLabelAssignRequestSchema,
          example: {
            labelId: "clxxxxxxxxxxxxxxx",
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

labelRegistry.registerPath({
  path: "/api/v1/card/{cardId}/label/{labelId}",
  method: "delete",
  tags: ["Label"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string(),
      labelId: z.string(),
    }),
  },
  responses: createApiResponse(z.null(), "Success"),
});

export function BoardLabelRouter(labelController: LabelController): Router {
  const router = Router({ mergeParams: true });

  router.get(
    "/",
    asyncHandler(authenticate()),
    authorize(["VIEW_BOARD"], "board"),
    asyncHandler(labelController.getBoardLabels)
  );

  router.post(
    "/",
    asyncHandler(authenticate()),
    authorize(["UPDATE_BOARD"], "board"),
    asyncHandler(labelController.createLabel)
  );

  router.put(
    "/:labelId",
    asyncHandler(authenticate()),
    authorize(["UPDATE_BOARD"], "board"),
    asyncHandler(labelController.updateLabel)
  );

  router.delete(
    "/:labelId",
    asyncHandler(authenticate()),
    authorize(["UPDATE_BOARD"], "board"),
    asyncHandler(labelController.deleteLabel)
  );

  return router;
}

export function CardLabelRouter(labelController: LabelController): Router {
  const router = Router({ mergeParams: true });

  router.get(
    "/:cardId/label",
    asyncHandler(authenticate()),
    authorize(["VIEW_CARD"], "board"),
    asyncHandler(labelController.getLabelsOfCard)
  );

  router.post(
    "/:cardId/label",
    asyncHandler(authenticate()),
    authorize(["UPDATE_CARD"], "board"),
    asyncHandler(labelController.assignLabelToCard)
  );

  router.delete(
    "/:cardId/label/:labelId",
    asyncHandler(authenticate()),
    authorize(["UPDATE_CARD"], "board"),
    asyncHandler(labelController.removeLabelFromCard)
  );

  return router;
}
