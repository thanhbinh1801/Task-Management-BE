import { Router, Request, Response, NextFunction } from "express";
import AuthController from "./auth.controller";
import { guard } from "@/commons/middlewares/guard.middleware";
import passport from "./google.strategy";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { LoginSchema, RegisterSchema } from "@/commons";
import { createApiResponse } from "@/swagger";

export const authRegistry = new OpenAPIRegistry();

authRegistry.registerPath({
  path: "/auth/login",
  method: "post",
  tags: ["Auth"],
  responses: createApiResponse(LoginSchema, 'Success'),
});

authRegistry.registerPath({
  path: "/auth/register",
  method: "post",
  tags: ["Auth"],
  responses: createApiResponse(RegisterSchema, 'Success'),
});

export function makeAuthRouter(controller: AuthController) {
  const router = Router();

  router.post("/login", guard(LoginSchema), controller.login);
  router.post("/register", guard(RegisterSchema), controller.register);


  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/v1/auth/login-failed' }),
    (_req: Request, res: Response) => {
      res.redirect('/api/v1/auth/profile');
    }
  );

  router.get('/login-failed', (_req, res) => res.status(400).send('Login failed'));

  router.get('/profile', (req: Request, res: Response) => {
    res.json({ user: (req as any).user });
  });


  return router;
}
