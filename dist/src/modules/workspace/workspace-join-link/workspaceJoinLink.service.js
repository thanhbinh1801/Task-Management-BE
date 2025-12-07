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
// import { WorkspaceJoinLink } from "@prisma/client";
const crypto_1 = require("crypto");
const commons_1 = require("@/commons");
const configs_1 = require("@/configs");
class WorkspaceJoinLinkService {
    constructor(workspaceJoinLinkRepo) {
        this.workspaceJoinLinkRepo = workspaceJoinLinkRepo;
    }
    createLink(workspaceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, crypto_1.randomBytes)(24).toString("hex");
            const newLink = yield this.workspaceJoinLinkRepo.createLink(token, workspaceId, userId);
            if (!newLink) {
                throw new commons_1.InternalServerException("can not create link to join workspace");
            }
            return `http://${configs_1.appEnv.HOST}:${configs_1.appEnv.PORT}/invite/${newLink.token}/workspace`;
        });
    }
    revokeLink(linkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isRevoke = yield this.workspaceJoinLinkRepo.revokeLink(linkId);
            if (!isRevoke) {
                throw new commons_1.InternalServerException("Can not revoke link to join workspace");
            }
        });
    }
}
exports.default = WorkspaceJoinLinkService;
