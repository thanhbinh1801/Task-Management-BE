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
exports.SocialAccountsPrismaRepository = void 0;
const prisma_1 = require("@/configs/prisma");
class SocialAccountsPrismaRepository {
    findByProviderId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ providerId, provider }) {
            return prisma_1.prisma.socialAccounts.findUnique({
                where: { provider_providerId: { provider, providerId } }
            });
        });
    }
    createSocialAccount(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.socialAccounts.create({
                data
            });
        });
    }
    checkUserInSocialAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield prisma_1.prisma.socialAccounts.findFirst({
                where: { user: { email } },
                select: { id: true }
            });
            return !!check;
        });
    }
}
exports.SocialAccountsPrismaRepository = SocialAccountsPrismaRepository;
