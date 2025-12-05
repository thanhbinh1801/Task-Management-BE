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
exports.CardPrismaRepository = void 0;
const configs_1 = require("@/configs");
const commons_1 = require("@/commons");
class CardPrismaRepository {
    findCards(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.card.findMany({
                where: { listId: listId, deletedAt: null }
            });
        });
    }
    findCardById(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.card.findFirst({
                where: { id: cardId, deletedAt: null }
            });
        });
    }
    createCard(cardData, listId) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.card.create({
                data: {
                    name: cardData.nameCard,
                    listId: listId,
                },
            });
        });
    }
    updateCard(cardData) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.card.update({
                where: { id: cardData.cardId },
                data: Object.assign({}, (cardData.nameCard && { name: cardData.nameCard })),
            });
        });
    }
    deleteCard(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.card.update({
                where: { id: cardId },
                data: {
                    deletedAt: new Date(),
                }
            });
        });
    }
    hardDeleteCard(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const card = yield configs_1.prisma.card.findUnique({
                where: { id: cardId }
            });
            if (!card) {
                throw new commons_1.NotFoundException("Card not found");
            }
            if (!card.deletedAt) {
                throw new commons_1.ConflictException("Cannot hard delete a card that is not soft deleted");
            }
            return configs_1.prisma.card.delete({
                where: { id: cardId }
            });
        });
    }
}
exports.CardPrismaRepository = CardPrismaRepository;
