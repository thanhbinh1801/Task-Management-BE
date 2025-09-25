import { Router } from "express";
import { makeAuthRouter } from "@/modules/auth/auth.route";
import AuthController from "@/modules/auth/auth.controller";
import AuthService from "@/modules/auth/auth.service";

const mainRouter = Router();

const authService = new AuthService();
const authController = new AuthController(authService); 

mainRouter.use("/", makeAuthRouter(authController));

export default mainRouter;