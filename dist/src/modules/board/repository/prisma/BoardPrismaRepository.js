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
exports.BoardPrismaRepository = void 0;
const configs_1 = require("@/configs");
const commons_1 = require("@/commons");
class BoardPrismaRepository {
    findBoards(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const boards = yield configs_1.prisma.board.findMany({
                where: { workspaceId: workspaceId, deletedAt: null },
                include: {
                    members: {
                        include: {
                            role: { select: { roleName: true } },
                            user: { select: { name: true, email: true, avatarUrl: true } }
                        }
                    },
                    List: {
                        where: { deletedAt: null },
                        include: {
                            Card: { where: { deletedAt: null } }
                        }
                    }
                }
            });
            return boards.map(board => ({
                id: board.id,
                name: board.name,
                workspaceId: board.workspaceId,
                members: board.members.map(m => {
                    var _a;
                    return ({
                        userId: m.userId,
                        userName: m.user.name || 'Unknown',
                        userEmail: m.user.email,
                        boardId: m.boardId,
                        roleId: m.roleId,
                        roleName: m.role.roleName,
                        avatarUrl: (_a = m.user.avatarUrl) !== null && _a !== void 0 ? _a : undefined,
                        createdAt: m.createdAt,
                        updatedAt: m.updatedAt
                    });
                }),
                lists: board.List.map(list => ({
                    id: list.id,
                    name: list.name,
                    boardId: list.boardId,
                    position: list.position.toNumber(),
                    cards: list.Card.map(card => ({
                        id: card.id,
                        name: card.name,
                        isComplete: card.isComplete
                    }))
                }))
            }));
        });
    }
    findBoardById(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield configs_1.prisma.board.findUnique({
                where: { id: boardId },
                include: {
                    members: {
                        include: {
                            role: { select: { roleName: true } },
                            user: { select: { name: true, email: true, avatarUrl: true } }
                        }
                    },
                    List: {
                        where: { deletedAt: null },
                        include: {
                            Card: { where: { deletedAt: null } }
                        }
                    }
                }
            });
            if (!board)
                return null;
            return {
                id: board.id,
                name: board.name,
                workspaceId: board.workspaceId,
                members: board.members.map(m => {
                    var _a;
                    return ({
                        userId: m.userId,
                        userName: m.user.name || 'Unknown',
                        userEmail: m.user.email,
                        boardId: m.boardId,
                        roleId: m.roleId,
                        roleName: m.role.roleName,
                        avatarUrl: (_a = m.user.avatarUrl) !== null && _a !== void 0 ? _a : undefined,
                        createdAt: m.createdAt,
                        updatedAt: m.updatedAt
                    });
                }),
                lists: board.List.map(list => ({
                    id: list.id,
                    name: list.name,
                    boardId: list.boardId,
                    position: list.position.toNumber(),
                    cards: list.Card.map(card => ({
                        id: card.id,
                        name: card.name,
                        isComplete: card.isComplete
                    }))
                }))
            };
        });
    }
    createBoard(boardData, workspaceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isWorkspaceExisted = yield configs_1.prisma.workspace.findFirst({
                where: { id: workspaceId, deletedAt: null }
            });
            if (!isWorkspaceExisted) {
                throw new commons_1.NotFoundException("Workspace not found or has been deleted");
            }
            return configs_1.prisma.board.create({
                data: {
                    name: boardData.nameBoard,
                    workspaceId: workspaceId,
                    members: {
                        create: {
                            user: { connect: { id: userId } },
                            role: { connect: { roleName: "OwnerBoard" } }
                        },
                    },
                },
            });
        });
    }
    updateBoard(boardData) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.board.update({
                where: { id: boardData.boardId },
                data: Object.assign({}, (boardData.nameBoard && { name: boardData.nameBoard })),
            });
        });
    }
    deleteBoard(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Soft delete cascade: board -> lists -> cards, and delete board members
            const board = yield configs_1.prisma.board.findUnique({
                where: { id: boardId },
                include: {
                    List: {
                        where: { deletedAt: null },
                        include: {
                            Card: { where: { deletedAt: null } }
                        }
                    }
                }
            });
            if (!board) {
                throw new commons_1.NotFoundException("Board not found");
            }
            const now = new Date();
            // Soft delete all cards in all lists
            const cardIds = board.List.flatMap(list => list.Card.map(card => card.id));
            if (cardIds.length > 0) {
                yield configs_1.prisma.card.updateMany({
                    where: { id: { in: cardIds } },
                    data: { deletedAt: now }
                });
            }
            // Soft delete all lists
            const listIds = board.List.map(list => list.id);
            if (listIds.length > 0) {
                yield configs_1.prisma.list.updateMany({
                    where: { id: { in: listIds } },
                    data: { deletedAt: now }
                });
            }
            // Delete all board members
            yield configs_1.prisma.boardMember.deleteMany({
                where: { boardId: boardId }
            });
            // Delete all board members 
            yield configs_1.prisma.boardMember.deleteMany({
                where: { boardId: boardId }
            });
            // Delete all board join links
            yield configs_1.prisma.boardJoinLink.deleteMany({
                where: { boardId: boardId }
            });
            // Soft delete board
            return configs_1.prisma.board.update({
                where: { id: boardId },
                data: { deletedAt: now }
            });
        });
    }
    hardDeleteBoard(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield configs_1.prisma.board.findUnique({
                where: { id: boardId }
            });
            if (!board) {
                throw new commons_1.NotFoundException("Board not found");
            }
            if (!board.deletedAt) {
                throw new commons_1.ConflictException("Cannot hard delete a board that is not soft deleted");
            }
            return configs_1.prisma.board.delete({
                where: { id: boardId }
            });
        });
    }
}
exports.BoardPrismaRepository = BoardPrismaRepository;
