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
const passport_1 = __importDefault(require("passport"));
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authService.register(req.body);
                res.status(201).json(user);
            }
            catch (exception) {
                next(exception);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.login(req.body);
                res.cookie("refreshToken", result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                return res.json({
                    accessToken: result.accessToken,
                    user: result.user
                });
            }
            catch (exception) {
                next(exception);
            }
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Lấy refreshToken từ cookie thay vì body
                const { refreshToken } = req.cookies;
                if (!refreshToken) {
                    return res.status(401).json({ message: "No refresh token provided" });
                }
                const newTokens = yield this.authService.refreshToken(refreshToken);
                // Cập nhật refreshToken mới vào cookie
                res.cookie("refreshToken", newTokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                res.json({ accessToken: newTokens.accessToken });
            }
            catch (exception) {
                next(exception);
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                yield this.authService.forgotPassword(email);
                res.status(200).json({ message: "If the email exists, we sent a reset code." });
            }
            catch (exception) {
                next(exception);
            }
        });
        this.verifyEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                yield this.authService.verifyEmail(email, otp);
                res.status(200).json({ message: "Email verified successfully." });
            }
            catch (exception) {
                next(exception);
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newPassword } = req.body;
                const isSuccess = yield this.authService.resetPassword(email, newPassword);
                if (!isSuccess)
                    return res.status(400).json({ message: "Failed to reset password." });
                res.status(200).json({ message: "Password reset successfully." });
            }
            catch (exception) {
                next(exception);
            }
        });
        this.changePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.users) === null || _a === void 0 ? void 0 : _a.userId;
                const { oldPassword, newPassword } = req.body;
                yield this.authService.changePassword(userId, oldPassword, newPassword);
                res.status(200).json({ message: "Password changed successfully." });
            }
            catch (exception) {
                next(exception);
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                if (!refreshToken) {
                    return res.status(400).json({ message: "No refresh token provided" });
                }
                yield this.authService.logout(refreshToken);
                res.clearCookie("refreshToken");
                res.status(200).json({ message: "Logout successful" });
            }
            catch (exception) {
                next(exception);
            }
        });
        this.getMe = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.users) === null || _a === void 0 ? void 0 : _a.userId;
                const user = yield this.authService.getMe(userId);
                res.status(200).json({
                    status: "Success",
                    message: "User info retrieved successfully",
                    data: user
                });
            }
            catch (exception) {
                next(exception);
            }
        });
        // OAuth2 with Google
        this.googleAuth = (req, res, next) => {
            passport_1.default.authenticate('google', {
                scope: ['profile', 'email'],
                accessType: 'offline',
                prompt: 'consent'
            })(req, res, next);
        };
        this.googleAuthCallback = (req, res, next) => {
            passport_1.default.authenticate('google', {
                failureRedirect: '/api/v1/auth/login-failed',
                session: false
            }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return next(err);
                if (!user)
                    return res.redirect('/api/v1/auth/login-failed');
                try {
                    const result = yield this.authService.processGoogleLogin(user);
                    // Lưu refreshToken vào cookie
                    res.cookie("refreshToken", result === null || result === void 0 ? void 0 : result.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    });
                    return res.redirect(`${process.env.CORS_ORIGIN}/oauth/callback#token=${result === null || result === void 0 ? void 0 : result.accessToken}`);
                }
                catch (exception) {
                    next(exception);
                }
            }))(req, res, next);
        };
        this.authFailure = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.authFailed();
            }
            catch (exception) {
                next(exception);
            }
        });
    }
}
exports.default = AuthController;
