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
const jwt_util_1 = __importDefault(require("@/commons/utils/jwt.util"));
const hash_util_1 = __importDefault(require("@/commons/utils/hash.util"));
const commons_1 = require("@/commons");
const mail_util_1 = require("@/commons/utils/mail.util");
const exceptions_1 = require("@/commons/exceptions");
const client_1 = require("@prisma/client");
class AuthService {
    constructor(userService, accountRepo, socialAccountsRepo, tokenRepo, otpRepo) {
        this.userService = userService;
        this.accountRepo = accountRepo;
        this.socialAccountsRepo = socialAccountsRepo;
        this.tokenRepo = tokenRepo;
        this.otpRepo = otpRepo;
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = data.email.trim().toLowerCase();
            const user = yield this.userService.getUserByEmail(email);
            if (!user) {
                throw new commons_1.NotFoundException("user not found");
            }
            const account = yield this.accountRepo.findByUserId(user.id);
            if (!account) {
                throw new commons_1.NotFoundException("Account not found");
            }
            if (!account.passwordHash) {
                throw new commons_1.UnauthorizedException("User has no password hash");
            }
            const isEqual = yield hash_util_1.default.comparePW(data.password, account.passwordHash);
            if (!isEqual) {
                throw new commons_1.UnauthorizedException("password not equal");
            }
            const payload = {
                userId: user.id,
                email: user.email
            };
            const accessToken = jwt_util_1.default.signAccess(payload);
            const refreshToken = jwt_util_1.default.signRefresh(payload);
            const savedRefreshToken = yield this.tokenRepo.saveRefreshToken({
                userId: user.id,
                refreshToken: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            });
            if (!savedRefreshToken) {
                throw new exceptions_1.InternalServerException("Could not save refresh token");
            }
            return {
                accessToken,
                refreshToken,
                user
            };
        });
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const email = data.email.trim().toLowerCase();
            const existingUser = yield this.userService.getUserByEmail(email);
            if (existingUser) {
                throw new commons_1.ConflictException("email has exist already");
            }
            const passwordHash = yield hash_util_1.default.hashPW(data.password);
            const user = yield this.userService.createUser({
                email: data.email,
                name: (_a = data.name) !== null && _a !== void 0 ? _a : "",
                status: client_1.UserStatusEnum.ACTIVE,
                avatarUrl: (_b = data.avatarUrl) !== null && _b !== void 0 ? _b : "",
                passwordHash: passwordHash
            });
            return user;
        });
    }
    refreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedToken = yield this.tokenRepo.findByRefreshToken(token);
            if (!savedToken) {
                throw new commons_1.NotFoundException("refresh token not found");
            }
            const payload = jwt_util_1.default.verifyRefresh(token);
            const newAccessToken = jwt_util_1.default.signAccess({ userId: payload.userId, email: payload.email });
            const newRefreshToken = jwt_util_1.default.signRefresh({ userId: payload.userId, email: payload.email });
            yield this.tokenRepo.saveRefreshToken({
                userId: payload.userId,
                refreshToken: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            });
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUserByEmail(email.trim().toLowerCase());
            if (!user) {
                throw new commons_1.NotFoundException("user not found");
            }
            const createOtp = yield this.otpRepo.createOtp(user.id);
            if (!createOtp) {
                throw new exceptions_1.InternalServerException("Could not create OTP");
            }
            yield (0, mail_util_1.sendMail)(user.email, "Password Reset OTP.", `Your OTP for password reset is: ${createOtp.otp}. It is valid for 10 minutes.`);
            return true;
        });
    }
    verifyEmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUserByEmail(email.trim().toLowerCase());
            if (!user) {
                throw new commons_1.NotFoundException("user not found");
            }
            const isValidOtp = yield this.otpRepo.verifyOtp(user.id, otp);
            if (!isValidOtp) {
                throw new commons_1.UnauthorizedException("Invalid or expired OTP");
            }
            yield this.otpRepo.deleteOtp(user.id);
            yield this.userService.updateUser({ id: user.id, emailVerifiedAt: new Date() });
            return true;
        });
    }
    resetPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUserByEmail(email.trim().toLowerCase());
            if (!user) {
                throw new commons_1.NotFoundException("user not found");
            }
            if (!user.emailVerifiedAt || (new Date().getTime() - user.emailVerifiedAt.getTime()) > 10 * 60 * 1000) {
                throw new commons_1.UnauthorizedException("Email not verified for password reset");
            }
            const newPasswordHash = yield hash_util_1.default.hashPW(newPassword);
            const account = yield this.accountRepo.findByUserId(user.id);
            if (!account) {
                throw new commons_1.NotFoundException("Account not found");
            }
            account.passwordHash = newPasswordHash;
            yield this.accountRepo.updatePassword({ userId: user.id, password: newPasswordHash });
            const oldToken = yield this.tokenRepo.findByUserId(user.id);
            if (!oldToken) {
                throw new commons_1.NotFoundException("No refresh token found for user");
            }
            yield this.tokenRepo.deleteRefreshToken(oldToken.refreshToken);
            return true;
        });
    }
    changePassword(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new commons_1.UnauthorizedException("User ID is required");
            }
            const user = yield this.userService.getUserById(userId);
            if (!user) {
                throw new commons_1.NotFoundException("user not found");
            }
            const account = yield this.accountRepo.findByUserId(user.id);
            if (!account) {
                throw new commons_1.NotFoundException("Account not found");
            }
            if (!account.passwordHash) {
                throw new commons_1.UnauthorizedException("User has no password hash");
            }
            const isOldPasswordValid = yield hash_util_1.default.comparePW(oldPassword, account.passwordHash);
            if (!isOldPasswordValid) {
                throw new commons_1.UnauthorizedException("Invalid old password");
            }
            const newPasswordHash = yield hash_util_1.default.hashPW(newPassword);
            yield this.accountRepo.updatePassword({ userId: user.id, password: newPasswordHash });
            return true;
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tokenRepo.deleteRefreshToken(refreshToken);
            return;
        });
    }
    getMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUserById(userId);
            if (!user) {
                throw new commons_1.NotFoundException("User not found");
            }
            return user;
        });
    }
    processGoogleLogin(googleAuthData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { accessToken, refreshToken, profile, user } = googleAuthData;
            if (!user.email) {
                throw new commons_1.UnauthorizedException("Google account has no email");
            }
            const existingUser = yield this.userService.getUserByEmail(user.email);
            if (existingUser) {
                return { user: existingUser, accessToken, refreshToken };
            }
            else {
                const createdUser = yield this.userService.createGoogleUser({
                    email: user.email,
                    name: (_a = user.name) !== null && _a !== void 0 ? _a : "",
                    status: client_1.UserStatusEnum.ACTIVE,
                    avatarUrl: (_b = user.avatar) !== null && _b !== void 0 ? _b : "",
                    provider: 'google',
                    providerId: profile.id,
                    refreshToken: refreshToken,
                });
                if (!createdUser) {
                    throw new exceptions_1.InternalServerException("Could not create user");
                }
                return { user: createdUser, accessToken, refreshToken };
            }
        });
    }
    authFailed() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new commons_1.UnauthorizedException("google login failed");
        });
    }
}
exports.default = AuthService;
