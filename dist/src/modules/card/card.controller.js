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
const commons_1 = require("@/commons");
const card_request_1 = require("./dtos/requests/card.request");
class CardController {
    constructor(cardService) {
        this.cardService = cardService;
        this.getCards = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const listId = req.params.listId;
                if (!listId) {
                    throw new commons_1.BadRequestException("listId not found");
                }
                const cards = yield this.cardService.getCards(listId);
                res.status(200).json({
                    status: "success",
                    message: "get cards successfully",
                    data: cards
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.getCardById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cardId = req.params.cardId;
                if (!cardId) {
                    throw new commons_1.BadRequestException("cardId not found");
                }
                const card = yield this.cardService.getCardById(cardId);
                res.status(200).json({
                    status: "success",
                    message: "get card by id successfully",
                    data: card
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.createCard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const listId = req.params.listId;
                if (!listId) {
                    throw new commons_1.BadRequestException("listId not found");
                }
                const { nameCard } = card_request_1.CardCreateRequestSchema.parse(req.body);
                const cardData = { nameCard };
                const newCard = yield this.cardService.createCard(cardData, listId);
                res.status(201).json({
                    status: "success",
                    message: "create card successfully",
                    data: newCard
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.updateCard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const cardId = req.params.cardId;
                if (!cardId) {
                    throw new commons_1.BadRequestException("cardId not found");
                }
                const listId = req.params.listId;
                if (!listId) {
                    throw new commons_1.BadRequestException("listId not found");
                }
                const cardData = card_request_1.CardUpdateRequestSchema.parse({
                    cardId: cardId,
                    listId: listId,
                    nameCard: (_a = req.body) === null || _a === void 0 ? void 0 : _a.nameCard,
                });
                const updatedCard = yield this.cardService.updateCard(cardData);
                res.status(200).json({
                    status: "success",
                    message: "update card successfully",
                    data: updatedCard
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.deleteCard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cardId = req.params.cardId;
                if (!cardId) {
                    throw new commons_1.BadRequestException("cardId not found");
                }
                // Check if permanent delete is requested via query parameter
                const isPermanent = req.query.permanent === 'true';
                if (isPermanent) {
                    yield this.cardService.hardDeleteCard(cardId);
                }
                else {
                    yield this.cardService.deleteCard(cardId);
                }
                res.status(200).json({
                    status: "success",
                    message: isPermanent ? "permanently deleted card successfully" : "soft deleted card successfully",
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = CardController;
