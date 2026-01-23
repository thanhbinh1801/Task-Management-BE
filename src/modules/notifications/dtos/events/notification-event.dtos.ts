export enum NotificationEvent {
    NEW_NOTIFICATION = 'notification:new',
    NOTIFICATION_READ = 'notification:read',
    NOTIFICATION_DELETED = 'notification:deleted',
    NOTIFICATION_READ_ALL = 'notification:read_all',
}

export interface NotificationPayload {
    userId: string;
    actorId?: string;
    type: string;
    title: string;
    message: string;
    entityType?: string;
    entityId?: string;
}

export interface SocketAuthData {
    userId: string;
    socketId: string;
    email?: string;
}


