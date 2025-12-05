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
class JoinLinkService {
    constructor(joinLinkRepo, memberWorkspaceService, memberBoardService) {
        this.joinLinkRepo = joinLinkRepo;
        this.memberWorkspaceService = memberWorkspaceService;
        this.memberBoardService = memberBoardService;
    }
    checkToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const validToken = yield this.joinLinkRepo.checkToken(token);
            if (!validToken) {
                throw new commons_1.InternalServerException("can not check validation of token");
            }
            return validToken;
        });
    }
    join(token, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const validToken = yield this.checkToken(token);
            if (!validToken) {
                return null;
            }
            const { scope, id } = validToken;
            if (scope === "WORKSPACE") {
                return this.memberWorkspaceService.addMemberWorkspaceByEmail(email, id);
            }
            else if (scope === "BOARD") {
                return this.memberBoardService.addMemberBoardByEmail(email, id);
            }
            else {
                return null;
            }
        });
    }
}
exports.default = JoinLinkService;
