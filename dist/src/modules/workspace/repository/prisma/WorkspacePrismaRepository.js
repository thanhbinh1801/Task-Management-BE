"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacePrismaRepository = void 0;
const configs_1 = require("@/configs");
const commons_1 = require("@/commons");
class WorkspacePrismaRepository {
    findWorkspace(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspaces = yield configs_1.prisma.workspace.findMany({
                where: {
                    deletedAt: null,
                    members: {
                        some: { userId: userId }
                    }
                },
                include: {
                    members: {
                        include: {
                            role: { select: { roleName: true } },
                            user: { select: { name: true, email: true, avatarUrl: true } }
                        }
                    },
                    boards: { where: { deletedAt: null } }
                }
            });
            return workspaces.map(ws => ({
                id: ws.id,
                name: ws.name,
                visibility: ws.visibility,
                createdAt: ws.createdAt,
                updatedAt: ws.updatedAt,
                members: ws.members.map(m => {
                    var _a;
                    return ({
                        userId: m.userId,
                        userName: m.user.name || 'Unknown',
                        userEmail: m.user.email,
                        workspaceId: m.workspaceId,
                        roleId: m.roleId,
                        roleName: m.role.roleName,
                        avatarUrl: (_a = m.user.avatarUrl) !== null && _a !== void 0 ? _a : undefined,
                        createdAt: m.createdAt,
                        updatedAt: m.updatedAt
                    });
                }),
                boards: ws.boards.map(board => ({
                    id: board.id,
                    name: board.name,
                    workspaceId: board.workspaceId,
                    createdAt: board.createdAt,
                    updatedAt: board.updatedAt
                }))
            }));
        });
    }
    findWorkspaceById(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspace = yield configs_1.prisma.workspace.findUnique({
                where: { id: workspaceId },
                include: {
                    members: {
                        include: {
                            role: { select: { roleName: true } },
                            user: { select: { name: true, email: true, avatarUrl: true } }
                        }
                    },
                    boards: { where: { deletedAt: null } }
                }
            });
            if (!workspace)
                return null;
            return {
                id: workspace.id,
                name: workspace.name,
                visibility: workspace.visibility,
                createdAt: workspace.createdAt,
                updatedAt: workspace.updatedAt,
                members: workspace.members.map(m => {
                    var _a;
                    return ({
                        userId: m.userId,
                        userName: m.user.name || 'Unknown',
                        userEmail: m.user.email,
                        workspaceId: m.workspaceId,
                        roleId: m.roleId,
                        roleName: m.role.roleName,
                        avatarUrl: (_a = m.user.avatarUrl) !== null && _a !== void 0 ? _a : undefined,
                        createdAt: m.createdAt,
                        updatedAt: m.updatedAt
                    });
                }),
                boards: workspace.boards
            };
        });
    }
    createWorkspace(workspaceData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.workspace.create({
                data: {
                    name: workspaceData.name,
                    visibility: workspaceData.visibility,
                    members: {
                        create: {
                            user: { connect: { id: userId } },
                            role: { connect: { roleName: "OwnerWorkspace" }, }
                        },
                    },
                }
            });
        });
    }
    updateWorkspace(workspaceData, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.workspace.update({
                where: { id: workspaceId },
                data: Object.assign(Object.assign({}, (workspaceData.name && { name: workspaceData.name })), (workspaceData.visibility && { visibility: workspaceData.visibility }))
            });
        });
    }
    deleteWorkspace(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspace = yield configs_1.prisma.workspace.findUnique({
                where: { id: workspaceId },
                include: {
                    boards: {
                        include: {
                            List: {
                                include: {
                                    Card: true
                                }
                            }
                        }
                    },
                    members: true,
                    joinLinks: true
                }
            });
            if (!workspace) {
                throw new commons_1.NotFoundException("Workspace not found");
            }
            const now = new Date();
            // Soft delete all cards in this workspace
            const cardIds = workspace.boards.flatMap(board => board.List.flatMap(list => list.Card.map(card => card.id)));
            if (cardIds.length > 0) {
                yield configs_1.prisma.card.updateMany({
                    where: { id: { in: cardIds } },
                    data: { deletedAt: now }
                });
            }
            const listIds = workspace.boards.flatMap(board => board.List.map(list => list.id));
            if (listIds.length > 0) {
                yield configs_1.prisma.list.updateMany({
                    where: { id: { in: listIds } },
                    data: { deletedAt: now }
                });
            }
            const boardIds = workspace.boards.map(board => board.id);
            if (boardIds.length > 0) {
                yield configs_1.prisma.board.updateMany({
                    where: { id: { in: boardIds } },
                    data: { deletedAt: now }
                });
            }
            // Delete BoardMembers for all boards in this workspace
            if (boardIds.length > 0) {
                yield configs_1.prisma.boardMember.deleteMany({
                    where: { boardId: { in: boardIds } }
                });
            }
            // Delete WorkspaceMembers
            yield configs_1.prisma.workspaceMember.deleteMany({
                where: { workspaceId: workspaceId }
            });
            // Delete WorkspaceJoinLinks
            yield configs_1.prisma.workspaceJoinLink.deleteMany({
                where: { workspaceId: workspaceId }
            });
            // Delete BoardJoinLinks for all boards in this workspace
            if (boardIds.length > 0) {
                yield configs_1.prisma.boardJoinLink.deleteMany({
                    where: { boardId: { in: boardIds } }
                });
            }
            return configs_1.prisma.workspace.update({
                where: { id: workspaceId },
                data: { deletedAt: now }
            });
        });
    }
    hardDeleteWorkspace(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspace = yield configs_1.prisma.workspace.findUnique({
                where: { id: workspaceId }
            });
            if (!workspace) {
                throw new commons_1.NotFoundException("Workspace not found");
            }
            if (!workspace.deletedAt) {
                throw new commons_1.ConflictException("Cannot hard delete a workspace that is not soft deleted");
            }
            return configs_1.prisma.workspace.delete({
                where: { id: workspaceId }
            });
        });
    }
}
exports.WorkspacePrismaRepository = WorkspacePrismaRepository;
