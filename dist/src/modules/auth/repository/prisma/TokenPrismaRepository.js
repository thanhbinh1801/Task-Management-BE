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
exports.TokenPrismaRepository = void 0;
const prisma_1 = require("@/configs/prisma");
class TokenPrismaRepository {
    saveRefreshToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, refreshToken, expiresAt }) {
            return prisma_1.prisma.token.upsert({
                where: { userId },
                update: { refreshToken, expiresAt },
                create: { userId, refreshToken, expiresAt }
            });
        });
    }
    findByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.token.findFirst({
                where: { refreshToken }
            });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.token.findUnique({
                where: { userId }
            });
        });
    }
    deleteRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.token.deleteMany({
                where: { refreshToken }
            });
        });
    }
}
exports.TokenPrismaRepository = TokenPrismaRepository;
