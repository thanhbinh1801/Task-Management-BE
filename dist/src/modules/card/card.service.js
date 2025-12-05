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
exports.CardService = void 0;
const commons_1 = require("@/commons");
class CardService {
    constructor(cardRepo) {
        this.cardRepo = cardRepo;
    }
    getCards(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cards = yield this.cardRepo.findCards(listId);
            if (cards.length === 0) {
                throw new commons_1.NotFoundException("Lists not found");
            }
            return cards;
        });
    }
    getCardById(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const card = yield this.cardRepo.findCardById(cardId);
            if (!card) {
                throw new commons_1.NotFoundException("Card not found");
            }
            return card;
        });
    }
    createCard(cardData, listId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCard = yield this.cardRepo.createCard(cardData, listId);
            if (!newCard) {
                throw new commons_1.InternalServerException("can not create card");
            }
            return newCard;
        });
    }
    updateCard(cardData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCard = yield this.cardRepo.updateCard(cardData);
            if (!updatedCard) {
                throw new commons_1.InternalServerException("can not update card");
            }
            return updatedCard;
        });
    }
    deleteCard(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDelete = yield this.cardRepo.deleteCard(cardId);
            if (!isDelete) {
                throw new commons_1.InternalServerException('can not delete card');
            }
        });
    }
    hardDeleteCard(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDelete = yield this.cardRepo.hardDeleteCard(cardId);
            if (!isDelete) {
                throw new commons_1.InternalServerException('can not hard delete card');
            }
        });
    }
}
exports.CardService = CardService;
