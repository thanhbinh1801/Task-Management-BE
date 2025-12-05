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
const configs_1 = require("@/configs");
class JoinLinkPrismaRepository {
    checkToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const wslink = yield configs_1.prisma.workspaceJoinLink.findUnique({
                where: { token: token },
                include: {
                    workspace: { select: { id: true, name: true } },
                },
            });
            if (wslink) {
                if (wslink.isRevoke) {
                    throw new commons_1.ForbiddenException('This link has been revoked.');
                }
                if (wslink.expiresAt < new Date()) {
                    throw new commons_1.ForbiddenException('This link has expired.');
                }
                return { scope: "WORKSPACE", link: wslink, id: wslink.workspaceId };
            }
            const blink = yield configs_1.prisma.boardJoinLink.findUnique({
                where: { token: token },
                include: {
                    board: { select: { id: true, name: true } }
                },
            });
            if (blink) {
                if (blink.isRevoke) {
                    throw new commons_1.ForbiddenException('This link has been revoked.');
                }
                if (blink.expiresAt < new Date()) {
                    throw new commons_1.ForbiddenException('This link has expired.');
                }
                return { scope: "BOARD", link: blink, id: blink.boardId };
            }
            return null;
        });
    }
}
exports.default = JoinLinkPrismaRepository;
