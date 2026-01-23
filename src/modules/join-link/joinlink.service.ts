import { InternalServerException } from "@/commons";
import IJoinLinkRepository from "./repositories/interfaces/IJoinLinkRepository";
import { JoinLinkResult } from "./repositories/interfaces/IJoinLinkRepository";
import MemberWorkspaceService from "../workspace/member-workspace/member.workspace.service";
import MemberBoardService from "../board/member-board/member.board.service";
import { BoardMember, WorkspaceMember } from "@prisma/client";
import { NotificationEventService } from "@/modules/notifications/services/notification-event.service";
import notificationGateway from "@/modules/notifications/notification.gateway";
import { NotificationEvent } from "@/modules/notifications/dtos/events/notification-event.dtos";
import { prisma } from "@/configs";

export default class JoinLinkService {
  constructor(
    private readonly joinLinkRepo: IJoinLinkRepository,
    private readonly memberWorkspaceService: MemberWorkspaceService,
    private readonly memberBoardService: MemberBoardService,
    private readonly notificationEventService?: NotificationEventService
  ) {}

  async checkToken(token: string): Promise<JoinLinkResult | null>{
    const validToken = await this.joinLinkRepo.checkToken(token);
    if(!validToken) {
      throw new InternalServerException("can not check validation of token");
    }
    return validToken
  }

  async join(token: string, email: string, actorId?: string): Promise<WorkspaceMember | BoardMember | null>{
    const validToken = await this.checkToken(token);
    if (!validToken) {
      return null;
    }
    const { scope, id } = validToken;
    
    let result: WorkspaceMember | BoardMember | null = null;
    
    if(scope === "WORKSPACE") {
      result = await this.memberWorkspaceService.addMemberWorkspaceByEmail(email, id);
      
      if (this.notificationEventService && actorId && result) {
        try {
          const workspace = await prisma.workspace.findUnique({
            where: { id },
            select: { name: true }
          });

          if (workspace) {
            const notification = await this.notificationEventService.notifyWorkSpaceInvitation(
              result.userId,
              actorId,
              id,
              workspace.name
            );

            notificationGateway.sendToUser(
              result.userId,
              NotificationEvent.NEW_NOTIFICATION,
              {
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                entityType: notification.entityType,
                entityId: notification.entityId,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
              }
            );
          }
        } catch (notifError) {
          console.error('Failed to send notification:', notifError);
        }
      }
    } else if (scope === "BOARD") {
      result = await this.memberBoardService.addMemberBoardByEmail(email, id);
      
      if (this.notificationEventService && actorId && result) {
        try {
          const board = await prisma.board.findUnique({
            where: { id },
            select: { name: true }
          });

          if (board) {
            const notification = await this.notificationEventService.notifyBoardInvitation(
              result.userId,
              actorId,
              id,
              board.name
            );

            notificationGateway.sendToUser(
              result.userId,
              NotificationEvent.NEW_NOTIFICATION,
              {
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                entityType: notification.entityType,
                entityId: notification.entityId,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
              }
            );
          }
        } catch (notifError) {
          console.error('Failed to send notification:', notifError);
        }
      }
    } else {
      return null;
    }
    
    return result;
  }
}