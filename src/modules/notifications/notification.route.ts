// import { Router } from "express";
// import { asyncHandler, authenticate , authorize} from "@/commons";
// import NotificationController from "./notification.controller";
// import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
// // import { createApiResponse } from "@/swagger";
// // import z from "zod";

// export const notificationRegistry = new OpenAPIRegistry();



// export default function notificationRouter(
//   notificationController : NotificationController
//   ) : Router {
//   const notificationRouter = Router();

//   notificationRouter.get('/', notificationController.TestSocket)
  

//   return notificationRouter;
// }
import { Router } from "express";
import { asyncHandler, authenticate } from "@/commons";
import NotificationController from "./notification.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";
import { GetNotificationsQuerySchema } from "./dtos/requests/notification.query";

export const notificationRegistry = new OpenAPIRegistry();

// Get notifications
notificationRegistry.registerPath({
  path: "/api/v1/notifications",
  method: "get",
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  request: {
    query: GetNotificationsQuerySchema,
  },
  responses: createApiResponse(z.any(), "Get notifications successfully"),
});

// Mark as read
notificationRegistry.registerPath({
  path: "/api/v1/notifications/{id}/read",
  method: "patch",
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: createApiResponse(z.any(), "Notification marked as read"),
});

// Mark all as read
notificationRegistry.registerPath({
  path: "/api/v1/notifications/read-all",
  method: "patch",
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  responses: createApiResponse(z.any(), "All notifications marked as read"),
});

// Delete notification
notificationRegistry.registerPath({
  path: "/api/v1/notifications/{id}",
  method: "delete",
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: createApiResponse(z.null(), "Notification deleted successfully"),
});

// Get unread count
notificationRegistry.registerPath({
  path: "/api/v1/notifications/unread-count",
  method: "get",
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  responses: createApiResponse(z.object({ unreadCount: z.number() }), "Get unread count"),
});

export default function notificationRouter(
  notificationController: NotificationController
): Router {
  const router = Router();

  router.get("/", authenticate, asyncHandler(notificationController.getNotifications));
  router.get("/unread-count", authenticate, asyncHandler(notificationController.getUnreadCount));
  router.patch("/read-all", authenticate, asyncHandler(notificationController.markAllAsRead));
  router.patch("/:id/read", authenticate, asyncHandler(notificationController.markAsRead));
  router.delete("/:id", authenticate, asyncHandler(notificationController.deleteNotification));

  return router;
}