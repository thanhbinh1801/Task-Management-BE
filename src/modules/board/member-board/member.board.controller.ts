import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "@/commons";
import MemberBoardService from "./member.board.service";
import { NotificationEventService } from "@/modules/notifications/services/notification-event.service";
import notificationGateway from "@/modules/notifications/notification.gateway";
import { NotificationEvent } from "@/modules/notifications/dtos/events/notification-event.dtos";
import { prisma } from "@/configs";

export default class MemberBoardController {
  constructor(
    private readonly memberService: MemberBoardService,
    private readonly notificationEventService?: NotificationEventService
  ) {}

  addMemberBoardByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException(' board id not found');
      }
      const email = req.body.email;
      if(!email) {
        throw new BadRequestException(' email not found');
      }
      const actorId = req.users?.userId;
      const newMember = await this.memberService.addMemberBoardByEmail(email, boardId);
      
      const board = await prisma.board.findUnique({
        where: { id: boardId },
        select: { name: true }
      });

      if (this.notificationEventService && actorId && board) {
        try {
          const notification = await this.notificationEventService.notifyBoardInvitation(
            newMember.userId,
            actorId,
            boardId,
            board.name
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
        message: "add board member successfully",
        json: newMember
      });

    } catch (err) {
      next(err);
    }
  }

  viewMemberBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException(' board id not found');
      }
      const allMembers = await this.memberService.getMember(boardId);
      res.status(200).json({
        status: "success",
        message: "get all board member successfully",
        json: allMembers
      });
    } catch (err) {
      next(err);
    }
  }

  changePermissionMemberBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException(' board id not found');
      }
      const userId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException(' userId id not found');
      }
      const role = req.body.role;
      if(!role) {
        throw new BadRequestException(' role not found');
      }
      const updateMember = await this.memberService.updateMember(boardId, userId, role);
      res.status(200).json({
        status: "success",
        message: "change permission board member successfully",
        json: updateMember
      });
    } catch (err) {
      next(err);
    }
  }


  removeMemberBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId;
      if(!boardId) {
        throw new BadRequestException(' board id not found');
      }
      const userId = req.body.userId || req.params.userId;
      const actorId = req.users?.userId;
      if(!userId) {
        throw new BadRequestException(' userId id not found');
      }
      const removeMember = await this.memberService.removeMember(boardId, userId);
      
      if (this.notificationEventService && actorId) {
        try {
          const board = await prisma.board.findUnique({
            where: { id: boardId },
            select: { name: true }
          });

          if (board) {
            const notification = await this.notificationEventService.createNotification({
              userId: userId,
              actorId: actorId,
              type: "BOARD_MEMBER_REMOVED",
              title: "Removed from Board",
              message: `You have been removed from board: ${board.name}`,
              entityType: "Board",
              entityId: boardId,
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
        message: "remove board member successfully",
        json: removeMember
      });
    } catch (err) {
      next(err);
    }
  }
}