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
exports.UserPrismaRepository = void 0;
const prisma_1 = require("@/configs/prisma");
class UserPrismaRepository {
    findUsers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ skip, take, name, email }) {
            return Promise.all([
                prisma_1.prisma.user.findMany({
                    skip,
                    take,
                    where: Object.assign(Object.assign({}, (name && { name: { contains: name, mode: "insensitive" } })), (email && { email: { contains: email, mode: "insensitive" } }))
                }),
                prisma_1.prisma.user.count({
                    where: Object.assign(Object.assign({}, (name && { name: { contains: name, mode: "insensitive" } })), (email && { email: { contains: email, mode: "insensitive" } }))
                })
            ]);
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.user.findUnique({ where: { id: userId } });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.user.findUnique({
                where: {
                    email,
                    account: {
                        isNot: null
                    }
                }
            });
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.user.upsert({
                where: { email: userData.email },
                create: {
                    name: userData.name,
                    email: userData.email,
                    status: userData.status,
                    avatarUrl: userData.avatarUrl,
                    account: {
                        create: {
                            passwordHash: userData.passwordHash
                        }
                    }
                },
                update: {
                    account: {
                        create: { passwordHash: userData.passwordHash },
                    }
                }
            });
        });
    }
    updateUser(updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.user.update({
                where: { id: updateData.id },
                data: Object.assign(Object.assign(Object.assign(Object.assign({}, (updateData.name && { name: updateData.name })), (updateData.email && { email: updateData.email })), (updateData.status != null && { status: updateData.status })), (updateData.emailVerifiedAt != null && { emailVerifiedAt: updateData.emailVerifiedAt }))
            });
        });
    }
    updateAvatarUser(userId, avatarUrl, avatarPublicId) {
        return prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                avatarUrl,
                avatarPublicId
            }
        });
    }
    createGoogleUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Kiểm tra user đã tồn tại chưa
            const existingUser = yield prisma_1.prisma.user.findUnique({
                where: { email: userData.email },
                include: { tokens: true }
            });
            if (existingUser) {
                // User đã tồn tại - update thông tin và upsert token
                yield prisma_1.prisma.socialAccounts.upsert({
                    where: {
                        provider_providerId: {
                            provider: userData.provider,
                            providerId: userData.providerId
                        }
                    },
                    create: {
                        userId: existingUser.id,
                        provider: userData.provider,
                        providerId: userData.providerId
                    },
                    update: {}
                });
                // Upsert token thay vì create
                yield prisma_1.prisma.token.upsert({
                    where: { userId: existingUser.id },
                    create: {
                        userId: existingUser.id,
                        refreshToken: userData.refreshToken,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    },
                    update: {
                        refreshToken: userData.refreshToken,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    }
                });
                // Update user info nếu cần
                return prisma_1.prisma.user.update({
                    where: { id: existingUser.id },
                    data: Object.assign(Object.assign({}, (userData.name ? { name: userData.name } : {})), (userData.avatarUrl ? { avatarUrl: userData.avatarUrl } : {}))
                });
            }
            // User chưa tồn tại - tạo mới
            return prisma_1.prisma.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    status: userData.status,
                    avatarUrl: userData.avatarUrl,
                    socialAccounts: {
                        create: {
                            provider: userData.provider,
                            providerId: userData.providerId
                        }
                    },
                    tokens: {
                        create: {
                            refreshToken: userData.refreshToken,
                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        }
                    }
                }
            });
        });
    }
}
exports.UserPrismaRepository = UserPrismaRepository;
