import { INotificationRepository } from "../repository/interfaces/INotificationRepository";
import { GetNotificationsQuery } from "../dtos/requests/notification.query";
import { NotificationPaginationResponse, NotificationResponse } from "../dtos/responses/notification.response";
import { Notification } from "@prisma/client";

export class NotificationService {
    constructor(private notificationRepository: INotificationRepository) {}

    async getNotifications(userId: string, query: GetNotificationsQuery): Promise<NotificationPaginationResponse> {
        const [notifications, totalItems] = await this.notificationRepository.findByUserId(userId, query);
        const unreadCount = await this.notificationRepository.countUnread(userId);
        
        const data: NotificationResponse[] = notifications.map((n: Notification) => ({
            id: n.id,
            userId: n.userId,
            actorId: n.actorId,
            actorName: (n as any).actor?.name || null,
            type: n.type,
            title: n.title,
            message: n.message,
            entityType: n.entityType,
            entityId: n.entityId,
            isRead: n.isRead,
            createdAt: n.createdAt,
        }));

        const totalPages = Math.ceil(totalItems / query.limit);

        return {
            data,
            meta: {
                page: query.page,
                limit: query.limit,
                totalItems,
                totalPages,
                unreadCount,
            }
        };
    }

    async markAsRead(notificationId: string, userId: string): Promise<NotificationResponse> {
        const notification = await this.notificationRepository.markAsRead(notificationId, userId);
        return {
            id: notification.id,
            userId: notification.userId,
            actorId: notification.actorId,
            actorName: (notification as any).actor?.name || null,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            entityType: notification.entityType,
            entityId: notification.entityId,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        };
    }

    async markAllAsRead(userId: string): Promise<number> {
        return this.notificationRepository.markAllAsRead(userId);;
    }

    async deleteNotification(notificationId: string, userId: string): Promise<void> {
        await this.notificationRepository.delete(notificationId, userId);
    }

    async getUnreadCount(userId: string): Promise<number> {
        return this.notificationRepository.countUnread(userId);
    }
}