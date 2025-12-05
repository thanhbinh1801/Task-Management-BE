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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpPrismaRepository = void 0;
const prisma_1 = require("@/configs/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class OtpPrismaRepository {
    createOtp(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedOtp = yield bcryptjs_1.default.hash(otp, salt);
            const expiryAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
            yield prisma_1.prisma.otp.create({
                data: {
                    userId,
                    otp: hashedOtp,
                    expiresAt: expiryAt
                }
            });
            return { otp, expiryAt };
        });
    }
    verifyOtp(userId, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpInstance = yield prisma_1.prisma.otp.findFirst({
                where: {
                    userId,
                    expiresAt: {
                        gte: new Date()
                    }
                }
            });
            if (!otpInstance)
                return false;
            return bcryptjs_1.default.compare(otp, otpInstance.otp);
        });
    }
    deleteOtp(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.otp.deleteMany({ where: { userId } });
        });
    }
}
exports.OtpPrismaRepository = OtpPrismaRepository;
