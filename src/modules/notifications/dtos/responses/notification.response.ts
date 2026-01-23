import { NotificationTypeEnum } from "@prisma/client";

export interface NotificationResponse {
    id: string;
    userId: string;
    actorId?: string;
    actorName?: string;
    type: NotificationTypeEnum;
    title: string;
    message:string;
    entityId?: string;
    entityType?: string;
    isRead: boolean;
    createdAt: Date;
}

export interface NotificationPaginationResponse {
    data: NotificationResponse[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        unreadCount: number;
    };
}