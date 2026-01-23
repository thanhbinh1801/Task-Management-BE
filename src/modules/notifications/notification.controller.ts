// import { io } from "socket.io-client";
// import { Request, Response } from "express";

// export default class NotificationController {
//   constructor() {}

//   async TestSocket(req: Request, res: Response){
//     const socket = io("http://localhost:8000");
//     socket.on("notification", (data) => {
//       console.log(" Received message: ", data);
//     })
//     return res.json({
//       message: "binh"
//     });
//   }
  
// }

import { Request, Response, NextFunction } from "express";
import { NotificationService } from "./services/notification.service";
import { GetNotificationsQuerySchema } from "./dtos/requests/notification.query";
import { BadRequestException } from "@/commons";

export default class NotificationController {
    constructor(private notificationService: NotificationService) {}

    getNotifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.users?.userId;
            if(!userId) {
                throw new BadRequestException("User ID is required");
            }

            const query = GetNotificationsQuerySchema.parse(req.query);
            const result = await this.notificationService.getNotifications(userId, query);

            res.status(200).json({
                status: "success",
                message: "Get notifications successfully",
                data: result.data,
                meta: result.meta
            });
        } catch (error) {
            next(error);
        }
    };

    markAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.users?.userId;
            const notificationId = req.params.id;

            if(!userId) {
                throw new BadRequestException("User ID is required");
            }

            const result = await this.notificationService.markAsRead(userId, notificationId);

            res.status(200).json({
                status: "success",
                message: "Mark notification as read successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.users?.userId;

            if(!userId) {
                throw new BadRequestException("User ID is required");
            }

            const count = await this.notificationService.markAllAsRead(userId);

            res.status(200).json({
                status: "success",
                message: `Marked ${count} notifications as read successfully`,
                data: { count }
            });
        } catch (error) {
            next(error);
        }
    };

    deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.users?.userId;
            const notificationId = req.params.id;

            if(!userId) {
                throw new BadRequestException("User ID is required");
            }

            await this.notificationService.deleteNotification(userId, notificationId);

            res.status(200).json({
                status: "success",
                message: "Delete notification successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.users?.userId;

            if(!userId) {
                throw new BadRequestException("User ID is required");
            }

            const count = await this.notificationService.getUnreadCount(userId);

            res.status(200).json({
                status: "success",
                message: "Get unread notifications count successfully",
                data: { count }
            });
        } catch (error) {
            next(error);
        }
    };
}
