import { INotificationRepository } from '../repository/interfaces/INotificationRepository';
import { NotificationPayload } from '../dtos/events/notification-event.dtos';
import { Notification } from '@prisma/client';

export class NotificationEventService {
    constructor(private notificationRepository: INotificationRepository) { }

    async createNotification(data: NotificationPayload): Promise<Notification> {
        return this.notificationRepository.create(data);
    }

    async notifyBoardInvitation(userId: string, actorId: string, boardId: string, boardName: string): Promise<Notification> {
        return this.createNotification({
            userId,
            actorId,
            type: "BOARD_INVITATION",
            title: "Board Invitation",
            message: `You have been invited to join the board: ${boardName}`,
            entityId: boardId,
            entityType: "Board",
        });
    }

    async notifyCardAssignment(userId: string, actorId: string, cardId: string, cardName: string, boardId: string): Promise<Notification> {
        return this.createNotification({
            userId,
            actorId,
            type: "CARD_ASSIGNED",
            title: "Card Assignment",
            message: `You have been assigned to the card: ${cardName}`,
            entityId: cardId,
            entityType: "Card",
        });
    }

    async notifyCardMention(userId: string, actorId: string, cardId: string, cardName: string, boardId: string): Promise<Notification> {
        return this.createNotification({
            userId,
            actorId,
            type: "CARD_MENTION",
            title: "You were mentioned",
            message: `You were mentioned in card: ${cardName}`,
            entityType: "Card",
            entityId: cardId,
        });
    }

    async notifyWorkSpaceInvitation(userId: string, actorId: string, workspaceId: string, workspaceName: string): Promise<Notification> {
        return this.createNotification({
            userId,
            actorId,
            type: "WORKSPACE_INVITATION",
            title: "Workspace Invitation",
            message: `You have been invited to workspace: ${workspaceName}`,
            entityType: "Workspace",
            entityId: workspaceId,
        });
    }
}
