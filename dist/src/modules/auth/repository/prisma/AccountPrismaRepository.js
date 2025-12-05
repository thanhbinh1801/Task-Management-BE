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
exports.AccountPrismaRepository = void 0;
const prisma_1 = require("@/configs/prisma");
class AccountPrismaRepository {
    createAccount(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.account.create({
                data: userData
            });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.account.findUnique({
                where: { userId }
            });
        });
    }
    updatePassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, password }) {
            return prisma_1.prisma.account.update({
                where: { userId: userId },
                data: { passwordHash: password }
            });
        });
    }
    checkUserInAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield prisma_1.prisma.account.findFirst({
                where: { user: { email } },
                select: { id: true }
            });
            return !!check; // chuyển sang boolean
        });
    }
}
exports.AccountPrismaRepository = AccountPrismaRepository;
