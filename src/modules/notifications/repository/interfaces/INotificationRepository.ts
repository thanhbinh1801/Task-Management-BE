import { Notification } from "@prisma/client";
import { NotificationPayload } from "../../dtos/events/notification-event.dtos";
import { GetNotificationsQuery } from "../../dtos/requests/notification.query";

export interface INotificationRepository {
    create(data: NotificationPayload): Promise<Notification>;
    findById(id: string): Promise<Notification | null>;
    findByUserId(userId: string, query: GetNotificationsQuery): Promise<[Notification[], number]>;
    markAsRead(id: string, userId: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<number>;
    delete(id: string, userId: string): Promise<void>;
    countUnread(userId: string): Promise<number>;
}
