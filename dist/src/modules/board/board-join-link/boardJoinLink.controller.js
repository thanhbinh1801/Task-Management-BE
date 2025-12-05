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
class BoardJoinLinkController {
    constructor(boardJoinLinkService) {
        this.boardJoinLinkService = boardJoinLinkService;
        this.createLink = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const boardId = req.params.boardId;
                if (!boardId) {
                    throw new commons_1.BadRequestException(' boardId not found');
                }
                const userId = (_a = req.users) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new commons_1.BadRequestException(' userId not found');
                }
                const newLink = yield this.boardJoinLinkService.createLink(boardId, userId);
                res.status(201).json({
                    status: "success",
                    message: "create link to join board successfully",
                    json: newLink
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.revokeLink = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const linkId = req.params.linkId;
                if (!linkId) {
                    throw new commons_1.BadRequestException(' linkId not found');
                }
                yield this.boardJoinLinkService.revokeLink(linkId);
                res.status(200).json({
                    status: "success",
                    message: "revoke link to join workspace successfully",
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = BoardJoinLinkController;
