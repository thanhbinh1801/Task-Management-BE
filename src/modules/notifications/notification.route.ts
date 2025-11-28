import { Router } from "express";
import { asyncHandler, authenticate , authorize} from "@/commons";
import NotificationController from "./notification.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
// import { createApiResponse } from "@/swagger";
// import z from "zod";

export const notificationRegistry = new OpenAPIRegistry();



export default function notificationRouter(
  notificationController : NotificationController
  ) : Router {
  const notificationRouter = Router();

  notificationRouter.get('/', notificationController.TestSocket)
  

  return notificationRouter;
}
