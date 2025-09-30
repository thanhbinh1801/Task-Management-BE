import { Router } from "express";
import { makeAuthRouter } from "@/modules/auth/auth.route";
import AuthController from "@/modules/auth/auth.controller";
import AuthService from "@/modules/auth/services/auth.service";
import { AccountPrismaRepository, SocialAccountsPrismaRepository, TokenPrismaRepository, OtpPrismaRepository } from "@/modules/auth/repository/prisma";
import { UserPrismaRepository } from "@/modules/user/repository/prisma/UserPrismaRepository";
import { GoogleStrategy } from "@/modules/auth/google.strategy";

const mainRouter = Router();

const accountPrismaRepository = new AccountPrismaRepository();
const socialAccountsPrismaRepository = new SocialAccountsPrismaRepository();
const tokenPrismaRepository = new TokenPrismaRepository();
const otpPrismaRepository = new OtpPrismaRepository();
const userPrismaRepository = new UserPrismaRepository();
const authService = new AuthService(userPrismaRepository, accountPrismaRepository, socialAccountsPrismaRepository, tokenPrismaRepository, otpPrismaRepository);
const authController = new AuthController(authService);

new GoogleStrategy();

mainRouter.use("/", makeAuthRouter(authController));

export default mainRouter;