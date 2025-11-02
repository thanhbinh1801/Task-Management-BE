import { asyncHandler } from "@/commons";
import { Router } from "express";
import JoinLinkController from "./joinlink.controller";

export default function JoinLinkRouter (joinLinkController: JoinLinkController ) : Router {
  const joinLinkRouter = Router();

  joinLinkRouter.get("/:token/preview", asyncHandler(joinLinkController.checkToken));
  joinLinkRouter.post("/:token", asyncHandler(joinLinkController.join));

  return joinLinkRouter;
}