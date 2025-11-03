import { asyncHandler, authenticate } from "@/commons";
import { Router } from "express";
import JoinLinkController from "./joinlink.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";

export const joinLinkRegistry = new OpenAPIRegistry();

joinLinkRegistry.registerPath({
  path: '/api/v1/invite/{token}/preview',
  method: "get",
  tags: ["Join-Link"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      token: z.string(),
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

joinLinkRegistry.registerPath({
  path: '/api/v1/invite/{token}',
  method: "post",
  tags: ["Join-Link"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      token: z.string(),
    })
  },
  responses: createApiResponse(z.null() , "Success"),
});

export default function JoinLinkRouter (joinLinkController: JoinLinkController ) : Router {
  const joinLinkRouter = Router();

  joinLinkRouter.get("/:token/preview", asyncHandler(authenticate()), asyncHandler(joinLinkController.checkToken));
  joinLinkRouter.post("/:token", asyncHandler(authenticate()), asyncHandler(joinLinkController.join));

  return joinLinkRouter;
}