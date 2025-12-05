"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRegistry = void 0;
exports.AuthRouter = AuthRouter;
const express_1 = require("express");
const authenticate_1 = require("@/commons/middlewares/authenticate");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const commons_1 = require("@/commons");
const swagger_1 = require("@/swagger");
const zod_1 = require("zod");
const async_handler_1 = require("@/commons/middlewares/async.handler");
exports.authRegistry = new zod_to_openapi_1.OpenAPIRegistry();
exports.authRegistry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});
exports.authRegistry.registerPath({
    path: "/api/v1/auth/login",
    method: "post",
    tags: ["Auth"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                example: {
                    email: "thanhbinhnkd@gmail.com",
                    password: "password123"
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(commons_1.LoginSchema, 'Success'),
});
exports.authRegistry.registerPath({
    path: "/api/v1/auth/register",
    method: "post",
    tags: ["Auth"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                example: {
                    email: "thanhbinhnkd@gmail.com",
                    password: "password123",
                    name: "Thanh Binh"
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(commons_1.RegisterSchema, 'Success'),
});
exports.authRegistry.registerPath({
    path: "/api/v1/auth/change-password",
    method: "post",
    tags: ["Auth"],
    security: [{ bearerAuth: [] }],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                example: {
                    oldPassword: "password123",
                    newPassword: "123456789b"
                }
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.z.null(), 'Success'),
});
exports.authRegistry.registerPath({
    path: "/api/v1/auth/refresh-token",
    method: "post",
    tags: ["Auth"],
    security: [{ bearerAuth: [] }],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                example: {
                    refreshToken: "your-refresh-token"
                }
            }
        }
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.z.null(), 'Success'),
});
exports.authRegistry.registerPath({
    path: "/api/v1/auth/forgot-password",
    method: "post",
    tags: ["Auth"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                example: {
                    email: "thanhbinhnkd@gmail.com"
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.z.null(), 'Success'),
});
exports.authRegistry.registerPath({
    path: "/api/v1/auth/verify-email",
    method: "post",
    tags: ["Auth"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                example: {
                    email: "thanhbinhnkd@gmail.com",
                    otp: "123456",
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.z.null(), 'Success'),
});
exports.authRegistry.registerPath({
    path: "/api/v1/auth/reset-password",
    method: "post",
    tags: ["Auth"],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                example: {
                    email: "thanhbinhnkd@gmail.com",
                    newPassword: "password123"
                },
            },
        },
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.z.null(), 'Success'),
});
exports.authRegistry.registerPath({
    path: "/api/v1/auth/logout",
    method: "get",
    tags: ["Auth"],
    security: [{ bearerAuth: [] }],
    responses: (0, swagger_1.createApiResponse)(zod_1.z.null(), 'Success'),
});
exports.authRegistry.registerPath({
    path: "/api/v1/auth/me",
    method: "get",
    tags: ["Auth"],
    security: [{ bearerAuth: [] }],
    responses: (0, swagger_1.createApiResponse)(zod_1.z.null(), 'Success'),
});
function AuthRouter(authController) {
    const authRouter = (0, express_1.Router)();
    authRouter.post("/login", (0, async_handler_1.asyncHandler)(authController.login));
    authRouter.post("/register", (0, async_handler_1.asyncHandler)(authController.register));
    authRouter.post('/refresh-token', (0, async_handler_1.asyncHandler)(authController.refreshToken));
    authRouter.post('/forgot-password', (0, async_handler_1.asyncHandler)(authController.forgotPassword));
    authRouter.post('/verify-email', (0, async_handler_1.asyncHandler)(authController.verifyEmail));
    authRouter.post('/reset-password', (0, async_handler_1.asyncHandler)(authController.resetPassword));
    authRouter.post('/change-password', (0, async_handler_1.asyncHandler)((0, authenticate_1.authenticate)()), (0, async_handler_1.asyncHandler)(authController.changePassword));
    authRouter.get('/logout', (0, async_handler_1.asyncHandler)(authController.logout));
    authRouter.get('/me', (0, async_handler_1.asyncHandler)((0, authenticate_1.authenticate)()), (0, async_handler_1.asyncHandler)(authController.getMe));
    //Oauth2
    authRouter.get('/google', (0, async_handler_1.asyncHandler)(authController.googleAuth));
    authRouter.get('/google/callback', (0, async_handler_1.asyncHandler)(authController.googleAuthCallback));
    authRouter.get('/login-failed', (0, async_handler_1.asyncHandler)(authController.authFailure));
    authRouter.get('/profile', (req, res) => {
        res.json({ user: req.user });
    });
    return authRouter;
}
