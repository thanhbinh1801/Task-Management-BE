import { prisma } from "@/configs";
import { Notification } from "@prisma/client";
import { INotificationRepository } from "../interfaces/INotificationRepository";
import { NotificationPayload } from "../../dtos/events/notification-event.dtos";
import { GetNotificationsQuery } from "../../dtos/requests/notification.query";
import { NotFoundException } from "@/commons";

export class NotificationRepository implements INotificationRepository {
    async create(data: NotificationPayload): Promise<Notification> {
        return prisma.notification.create({
            data: {
                userId: data.userId,
                actorId: data.actorId,
                type: data.type,
                title: data.title,
                message: data.message,
                entityType: data.entityType,
                entityId: data.entityId,
            }
        });
    }

    async findById(id: string): Promise<Notification | null> {
        return prisma.notification.findUnique({
            where: { id},
            include: { 
                actor: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
    }

    async findByUserId(userId: string, query: GetNotificationsQuery): Promise<[Notification[], number]> {
        const { page, limit, isRead, type} = query;
        const skip = (page - 1) * limit;

        const where: any = { userId };
        if (isRead !== undefined) {
            where.isRead = isRead;
        }

        if (type) {
            where.type = type;
        }

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    actor: {
                        select: {
                            id: true,   
                            name: true,
                        }
                    }
                }
            }),
            prisma.notification.count({ where })
        ]);

        return [notifications, total];
    }

    async markAsRead(id: string, userId: string): Promise<Notification> {
        const notification = await prisma.notification.findFirst({
            where: { id, userId },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        return prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
    }

    async markAllAsRead(userId: string): Promise<number> {
        const result = await prisma.notification.updateMany(
            {
                where: { userId, isRead: false },
                data: { isRead: true }
            }
        )

        return result.count;
    }

    async delete(id: string, userId: string):  Promise<void> {
        const notification = await prisma.notification.findFirst({
            where: { id, userId},
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        await prisma.notification.delete({where: {id}})
    }

    async countUnread(userId: string): Promise<number> {
        return prisma.notification.count({
            where: { userId, isRead: false }
        });
    }
}