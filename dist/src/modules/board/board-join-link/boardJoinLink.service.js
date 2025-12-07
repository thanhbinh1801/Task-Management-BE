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
const crypto_1 = require("crypto");
const commons_1 = require("@/commons");
class BoardJoinLinkService {
    constructor(boardJoinLinkRepo) {
        this.boardJoinLinkRepo = boardJoinLinkRepo;
    }
    createLink(boardId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, crypto_1.randomBytes)(24).toString("hex");
            const newLink = yield this.boardJoinLinkRepo.createLink(token, boardId, userId);
            if (!newLink) {
                throw new commons_1.InternalServerException("can not create link to join board");
            }
            return newLink;
        });
    }
    revokeLink(linkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isRevoke = yield this.boardJoinLinkRepo.revokeLink(linkId);
            if (!isRevoke) {
                throw new commons_1.InternalServerException("Can not revoke link to join board");
            }
        });
    }
}
exports.default = BoardJoinLinkService;
