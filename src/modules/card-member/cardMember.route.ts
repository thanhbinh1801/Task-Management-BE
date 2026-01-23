import { asyncHandler, authenticate, authorize, BadRequestException } from "@/commons";
import { createApiResponse } from "@/swagger";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import z from "zod";
import CardMemberController from "./cardMember.controller";
import { CardMemberAssignRequestSchema } from "./dtos/requests/cardMember.request";
import { CardMemberService } from "./cardMember.service";

export const cardMemberRegistry = new OpenAPIRegistry();

cardMemberRegistry.registerPath({
  path: "/api/v1/card/{cardId}/member",
  method: "get",
  tags: ["Card Member"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string(),
    }),
  },
  responses: createApiResponse(z.null(), "Success"),
});

cardMemberRegistry.registerPath({
  path: "/api/v1/card/{cardId}/member",
  method: "post",
  tags: ["Card Member"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: CardMemberAssignRequestSchema,
          example: {
            userId: "clxxxxxxxxxxxxxxx",
          },
        },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

cardMemberRegistry.registerPath({
  path: "/api/v1/card/{cardId}/member/{userId}",
  method: "delete",
  tags: ["Card Member"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z.string(),
      userId: z.string(),
    }),
  },
  responses: createApiResponse(z.null(), "Success"),
});

export function CardMemberRouter(cardMemberController: CardMemberController, cardMemberService: CardMemberService): Router {
  const router = Router({ mergeParams: true });

  const attachBoardId = asyncHandler(async (req, _res, next) => {
    const cardId = req.params.cardId;
    if (!cardId) {
      throw new BadRequestException("cardId not found");
    }
    const card = await cardMemberService.ensureCard(cardId as string);
    req.params.boardId = card.boardId;
    return next();
  });

  router.get(
    "/:cardId/member",
    asyncHandler(authenticate()),
    attachBoardId,
    authorize(["VIEW_CARD"], "board"),
    asyncHandler(cardMemberController.getCardMembers)
  );

  router.post(
    "/:cardId/member",
    asyncHandler(authenticate()),
    attachBoardId,
    authorize(["UPDATE_CARD"], "board"),
    asyncHandler(cardMemberController.assignMemberToCard)
  );

  router.delete(
    "/:cardId/member/:userId",
    asyncHandler(authenticate()),
    attachBoardId,
    authorize(["UPDATE_CARD"], "board"),
    asyncHandler(cardMemberController.removeMemberFromCard)
  );

  return router;
}
