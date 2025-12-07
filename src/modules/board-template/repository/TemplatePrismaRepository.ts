import { prisma } from "@/configs";
import { Board, Decimal } from "@prisma/client";
import { NotFoundException } from "@/commons";
import { ITemplateRepository, TemplateDetails } from "../interfaces/ITemplateRepository";

export class TemplatePrismaRepository implements ITemplateRepository {
    async getAllTemplates(): Promise<TemplateDetails[]> {
        const templates = await prisma.board.findMany({
            where: {
                isTemplate: true,
                workspaceId: null,
            },
            include: {
                List: {
                    where: { deletedAt: null },
                    orderBy: { position: 'asc' },
                    include: {
                        Card: {
                            where: { deletedAt: null },
                            select: { id: true, name: true }
                        }
                    }
                }
            },
            orderBy: { category: 'asc' }
        });

        return templates.map(t => ({
            id: t.id,
            name: t.name,
            category: t.category,
            description: t.description,
            lists: t.List.map(list => ({
                id: list.id,
                name: list.name,
                position: list.position.toNumber(),
                cards: list.Card.map(card => ({
                    id: card.id,
                    name: card.name
                }))
            }))
        }));
    }

    async getTemplateById(templateId: string): Promise<TemplateDetails | null> {
        const template = await prisma.board.findFirst({
            where: {
                id: templateId,
                isTemplate: true,
                workspaceId: null,
                deletedAt: null
            },
            include: {
                List: {
                    where: { deletedAt: null },
                    orderBy: { position: 'asc' },
                    include: {
                        Card: {
                            where: { deletedAt: null },
                            select: { id: true, name: true }
                        }
                    }
                }
            }
        });

        if (!template) {
            throw new NotFoundException("Template not found");
        }

        return {
            id: template.id,
            name: template.name,
            category: template.category,
            description: template.description,
            lists: template.List.map(list => ({
                id: list.id,
                name: list.name,
                position: list.position.toNumber(),
                cards: list.Card.map(card => ({
                    id: card.id,
                    name: card.name
                }))
            }))
        };
    }

    async getTemplatesByCategory(category: string): Promise<TemplateDetails[]> {
        const templates = await prisma.board.findMany({
            where: {
                isTemplate: true,
                category: category,
                workspaceId: null,
                deletedAt: null
            },
            include: {
                List: {
                    where: { deletedAt: null },
                    orderBy: { position: 'asc' },
                    include: {
                        Card: {
                            where: { deletedAt: null },
                            select: { id: true, name: true }
                        }
                    }
                }
            }
        });

        return templates.map(t => ({
            id: t.id,
            name: t.name,
            category: t.category,
            description: t.description,
            lists: t.List.map(list => ({
                id: list.id,
                name: list.name,
                position: list.position.toNumber(),
                cards: list.Card.map(card => ({
                    id: card.id,
                    name: card.name
                }))
            }))
        }));
    }

    async cloneTemplateToBoard(
        templateId: string,
        boardName: string,
        workspaceId: string,
        userId: string
    ): Promise<Board> {

        const template = await this.getTemplateById(templateId);

        if (!template) {
            throw new NotFoundException("Template not found");
        }

        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, deletedAt: null }
        });

        if (!workspace) {
            throw new NotFoundException("Workspace not found or has been deleted");
        }

        const newBoard = await prisma.board.create({
            data: {
                name: boardName,
                workspaceId: workspaceId,
                isTemplate: false,
                category: null,
                description: null,
                members: {
                    create: {
                        user: { connect: { id: userId } },
                        role: { connect: { roleName: "OwnerBoard" } }
                    }
                }
            }
        });

        for (const templateList of template.lists) {
            const newList = await prisma.list.create({
                data: {
                    name: templateList.name,
                    position: new Decimal(templateList.position),
                    boardId: newBoard.id,
                    deletedAt: null
                }
            });

            if (templateList.cards.length > 0) {
                await prisma.card.createMany({
                    data: templateList.cards.map(card => ({
                        name: card.name,
                        listId: newList.id,
                        isComplete: false,
                        deletedAt: null,
                    }))
                });
            }
        }

        return newBoard;
    }
}