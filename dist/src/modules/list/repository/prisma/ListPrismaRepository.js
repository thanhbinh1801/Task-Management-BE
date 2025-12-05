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
exports.ListPrismaRepository = void 0;
const configs_1 = require("@/configs");
const client_1 = require("@prisma/client");
const commons_1 = require("@/commons");
class ListPrismaRepository {
    findLists(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lists = yield configs_1.prisma.list.findMany({
                where: { boardId: boardId, deletedAt: null },
                orderBy: { position: 'asc' },
                include: {
                    Card: { where: { deletedAt: null } }
                }
            });
            return lists.map(list => ({
                id: list.id,
                name: list.name,
                position: list.position.toNumber(),
                boardId: list.boardId,
                createAt: list.createdAt,
                updateAt: list.updatedAt,
                cards: list.Card.map(card => ({
                    id: card.id,
                    name: card.name,
                    isComplete: card.isComplete,
                    createAt: card.createdAt,
                    updateAt: card.updatedAt
                }))
            }));
        });
    }
    findListById(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield configs_1.prisma.list.findFirst({
                where: { id: listId, deletedAt: null },
                include: {
                    Card: { where: { deletedAt: null } }
                }
            });
            if (!list)
                return null;
            return {
                id: list.id,
                name: list.name,
                position: list.position.toNumber(),
                boardId: list.boardId,
                createAt: list.createdAt,
                updateAt: list.updatedAt,
                cards: list.Card.map(card => ({
                    id: card.id,
                    name: card.name,
                    isComplete: card.isComplete,
                    createAt: card.createdAt,
                    updateAt: card.updatedAt
                }))
            };
        });
    }
    createList(listData, boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isBoardExisted = yield configs_1.prisma.board.findFirst({
                where: { id: boardId, deletedAt: null }
            });
            if (!isBoardExisted) {
                throw new commons_1.NotFoundException("Board not found or has been deleted");
            }
            const lastIndex = yield configs_1.prisma.list.findFirst({
                where: { boardId: boardId, deletedAt: null },
                orderBy: { position: 'desc' }
            });
            const STEP = new client_1.Prisma.Decimal(1000);
            return configs_1.prisma.list.create({
                data: {
                    name: listData.nameList,
                    boardId: boardId,
                    position: lastIndex ? lastIndex.position.plus(STEP) : STEP,
                },
            });
        });
    }
    updateList(listData) {
        return __awaiter(this, void 0, void 0, function* () {
            const STEP = new client_1.Prisma.Decimal(1000);
            const EPS = new client_1.Prisma.Decimal(0.000001);
            let [left, right] = yield Promise.all([
                listData.leftId ? configs_1.prisma.list.findFirst({
                    where: {
                        id: listData.leftId, deletedAt: null
                    }
                }) : null,
                listData.rightId ? configs_1.prisma.list.findFirst({
                    where: {
                        id: listData.rightId, deletedAt: null
                    }
                }) : null,
            ]);
            let newPos;
            if (left && right) {
                if (right.position.minus(left.position).lt(EPS)) {
                    //reindex needed
                    const lists = yield configs_1.prisma.list.findMany({
                        where: { boardId: left.boardId, deletedAt: null },
                        orderBy: { position: 'asc' }
                    });
                    if (lists.length === 0) {
                        throw new commons_1.NotFoundException("No lists found for reindexing");
                    }
                    for (let i = 0; i < lists.length; i++) {
                        lists[i] = yield configs_1.prisma.list.update({
                            where: { id: lists[i].id },
                            data: { position: new client_1.Prisma.Decimal(i * STEP.toNumber()) }
                        });
                    }
                    const [newLeft, newRight] = yield Promise.all([
                        listData.leftId ? configs_1.prisma.list.findFirst({
                            where: {
                                id: listData.leftId, deletedAt: null
                            }
                        }) : null,
                        listData.rightId ? configs_1.prisma.list.findFirst({
                            where: {
                                id: listData.rightId, deletedAt: null
                            }
                        }) : null,
                    ]);
                    left = newLeft;
                    right = newRight;
                }
                if (!left || !right) {
                    throw new commons_1.NotFoundException("Left or right list not found after reindexing");
                }
                newPos = left.position.plus(right.position).div(2);
            }
            else if (left && !right) {
                newPos = left.position.plus(STEP);
            }
            else if (!left && right) {
                newPos = right.position.minus(STEP);
            }
            else {
                newPos = STEP;
            }
            return configs_1.prisma.list.update({
                where: { id: listData.listId },
                data: Object.assign(Object.assign({}, (listData.nameList && { name: listData.nameList })), { position: newPos }),
            });
        });
    }
    deleteList(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Soft delete cascade: list -> cards
            const list = yield configs_1.prisma.list.findUnique({
                where: { id: listId },
                include: {
                    Card: { where: { deletedAt: null } }
                }
            });
            if (!list) {
                throw new commons_1.NotFoundException("List not found");
            }
            const now = new Date();
            // Soft delete all cards in this list
            const cardIds = list.Card.map(card => card.id);
            if (cardIds.length > 0) {
                yield configs_1.prisma.card.updateMany({
                    where: { id: { in: cardIds } },
                    data: { deletedAt: now }
                });
            }
            // Soft delete list
            return configs_1.prisma.list.update({
                where: { id: listId },
                data: { deletedAt: now }
            });
        });
    }
    hardDeleteList(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield configs_1.prisma.list.findUnique({
                where: { id: listId }
            });
            if (!list) {
                throw new commons_1.NotFoundException("List not found");
            }
            if (!list.deletedAt) {
                throw new commons_1.ConflictException("Cannot hard delete a list that is not soft deleted");
            }
            return configs_1.prisma.list.delete({
                where: { id: listId }
            });
        });
    }
}
exports.ListPrismaRepository = ListPrismaRepository;
