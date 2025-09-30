import { Router, Request, Response, NextFunction } from "express";
import AuthController from "./auth.controller";
import { guard } from "@/commons/middlewares/guard.middleware";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { LoginSchema, RegisterSchema } from "@/commons";
import { createApiResponse } from "@/swagger";
import { z } from "zod";

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

export function makeAuthRouter(controller: AuthController) {
  const router = Router();

  router.post("/login", controller.login);
  router.post("/register", controller.register);

  router.post('/refresh-token', controller.refreshToken);

  router.post('/forgot-password', controller.forgotPassword);

  router.post('/verify-email', controller.verifyEmail);

  router.post('/reset-password',controller.resetPassword);

  router.post('/change-password',guard(), controller.changePassword);

  router.get('/logout', controller.logout);
  
  //Oauth2
  router.get('/google', controller.googleAuth);

  router.get('/google/callback', controller.googleAuthCallback);

  router.get('/login-failed', controller.authFailure);

  router.get('/profile', (req: Request, res: Response) => {
    res.json({ user: (req as any).user });
  });

  return router;
}
