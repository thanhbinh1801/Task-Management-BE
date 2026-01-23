import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "@/commons";
import MemberWorkspaceService from "./member.workspace.service";
import { NotificationEventService } from "@/modules/notifications/services/notification-event.service";
import notificationGateway from "@/modules/notifications/notification.gateway";
import { NotificationEvent } from "@/modules/notifications/dtos/events/notification-event.dtos";
import { prisma } from "@/configs";

export default class MemberWorkspaceController {
  constructor(
    private readonly memberService: MemberWorkspaceService,
    private readonly notificationEventService?: NotificationEventService
  ) {}

  addMemberWorkspaceByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException(' workspace id not found');
      }
      const email = req.body.emailUser;
      if(!email) {
        throw new BadRequestException(' email not found');
      }
      const actorId = req.users?.userId;
      const newMember = await this.memberService.addMemberWorkspaceByEmail(email, workspaceId);
      
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { name: true }
      });

      if (this.notificationEventService && actorId && workspace) {
        try {
          const notification = await this.notificationEventService.notifyWorkSpaceInvitation(
            newMember.userId,
            actorId,
            workspaceId,
            workspace.name
          );

          notificationGateway.sendToUser(
            newMember.userId,
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
        } catch (notifError) {
          console.error('Failed to send notification:', notifError);
        }
      }

      res.status(201).json({
        status: "success",
        message: "add workspace member successfully",
        json: newMember
      });

    } catch (err) {
      next(err);
    }
  }
  
  viewMemberWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException(' workspace id not found');
      }
      const allMembers = await this.memberService.getMember(workspaceId);
      res.status(200).json({
        status: "success",
        message: "get all workspace member successfully",
        json: allMembers
      });
    } catch (err) {
      next(err);
    }
  }

  changePermissionMemberWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException(' workspace id not found');
      }
      const userId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException(' userId id not found');
      }
      const role = req.body.role;
      if(!role) {
        throw new BadRequestException(' role not found');
      }
      const updateMember = await this.memberService.updateMember(workspaceId, userId, role);
      res.status(200).json({
        status: "success",
        message: "change permission workspace member successfully",
        json: updateMember
      });
    } catch (err) {
      next(err);
    }
  }


  removeMemberWorkspace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.workspaceId;
      if(!workspaceId) {
        throw new BadRequestException(' workspace id not found');
      }
      const userId = req.body.userId || req.params.userId;
      const actorId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException(' userId id not found');
      }
      const removeMember = await this.memberService.removeMember(workspaceId, userId);
      
      if (this.notificationEventService && actorId) {
        try {
          const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { name: true }
          });

          if (workspace) {
            const notification = await this.notificationEventService.createNotification({
              userId: userId,
              actorId: actorId,
              type: "WORKSPACE_MEMBER_ADDED",
              title: "Removed from Workspace",
              message: `You have been removed from workspace: ${workspace.name}`,
              entityType: "Workspace",
              entityId: workspaceId,
            });

            notificationGateway.sendToUser(
              userId,
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

      res.status(200).json({
        status: "success",
        message: "remove workspace member successfully",
        json: removeMember
      });
    } catch (err) {
      next(err);
    }
  }
}