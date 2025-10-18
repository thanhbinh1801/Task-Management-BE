import { Router, Request, Response } from "express";
import AuthController from "./auth.controller";
import { authenticate } from "@/commons/middlewares/authenticate";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { LoginSchema, RegisterSchema } from "@/commons";
import { createApiResponse } from "@/swagger";
import { z } from "zod";
import { asyncHandler } from "@/commons/middlewares/async.handler";

export const authRegistry = new OpenAPIRegistry();

authRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

authRegistry.registerPath({
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
  responses: createApiResponse(LoginSchema, 'Success'),
});

authRegistry.registerPath({
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
  responses: createApiResponse(RegisterSchema, 'Success'),
});

authRegistry.registerPath({
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
  responses: createApiResponse(z.null(), 'Success'),
});

authRegistry.registerPath({
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
  responses: createApiResponse(z.null(), 'Success'),
});

authRegistry.registerPath({
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
  responses: createApiResponse(z.null(), 'Success'),
});

authRegistry.registerPath({
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
  responses: createApiResponse(z.null(), 'Success'),
});

authRegistry.registerPath({
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
  responses: createApiResponse(z.null(), 'Success'),
});

authRegistry.registerPath({
  path: "/api/v1/auth/logout",
  method: "get",
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  responses: createApiResponse(z.null(), 'Success'),
});

export function AuthRouter(authController: AuthController): Router {
  const authRouter = Router();

  authRouter.post("/login", asyncHandler(authController.login));
  authRouter.post("/register", asyncHandler(authController.register));

  authRouter.post('/refresh-token', asyncHandler(authController.refreshToken));

  authRouter.post('/forgot-password', asyncHandler(authController.forgotPassword));

  authRouter.post('/verify-email', asyncHandler(authController.verifyEmail));

  authRouter.post('/reset-password', asyncHandler(authController.resetPassword));

  authRouter.post('/change-password', asyncHandler(authenticate()), asyncHandler(authController.changePassword));

  authRouter.get('/logout', asyncHandler(authController.logout));
  
  //Oauth2
  authRouter.get('/google', asyncHandler(authController.googleAuth));

  authRouter.get('/google/callback', asyncHandler(authController.googleAuthCallback));

  authRouter.get('/login-failed', asyncHandler(authController.authFailure));

  authRouter.get('/profile', (req: Request, res: Response) => {
    res.json({ user: req.user });
  });

  return authRouter;
}
