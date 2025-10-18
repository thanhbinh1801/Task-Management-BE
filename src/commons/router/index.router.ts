import { Router } from "express";
import { AuthRouter } from "@/modules/auth/auth.route";
import AuthController from "@/modules/auth/auth.controller";
import AuthService from "@/modules/auth/services/auth.service";
import { AccountPrismaRepository, SocialAccountsPrismaRepository, TokenPrismaRepository, OtpPrismaRepository } from "@/modules/auth/repository/prisma";
import { UserPrismaRepository } from "@/modules/user/repository/prisma/UserPrismaRepository";
import { GoogleStrategy } from "@/modules/auth/google.strategy";

import { UserRouter } from "@/modules/user/user.route";
import UserController from "@/modules/user/user.controller";
import UserService from "@/modules/user/user.service"; 

import { WorkspaceRouter } from "@/modules/workspace/workspace.route";
import WorkspaceController from "@/modules/workspace/workspace.controller";
import WorkspaceService from "@/modules/workspace/workspace.service";
import { WorkspacePrismaRepository } from "@/modules/workspace/repository/prisma/WorkspacePrismaRepository";
import { BoardPrismaRepository } from "@/modules/board/repository/prisma/BoardPrismaRepository";
import { BoardService } from "@/modules/board/board.service";
import BoardController from "@/modules/board/board.controller";
import { BoardRouter } from "@/modules/board/board.route";

const mainRouter = Router();

const initAuthRouter = () => {
  const accountPrismaRepository = new AccountPrismaRepository();
  const socialAccountsPrismaRepository = new SocialAccountsPrismaRepository();
  const tokenPrismaRepository = new TokenPrismaRepository();
  const otpPrismaRepository = new OtpPrismaRepository();
  const userPrismaRepository = new UserPrismaRepository();
  const userService = new UserService(userPrismaRepository);
  const authService = new AuthService(userService, accountPrismaRepository, socialAccountsPrismaRepository, tokenPrismaRepository, otpPrismaRepository);
  const authController = new AuthController(authService);
  new GoogleStrategy();
  
  mainRouter.use("/auth", AuthRouter(authController));
}

const initUserRouter = () => {
  const userPrismaRepository = new UserPrismaRepository();
  const userService = new UserService(userPrismaRepository);
  const userController = new UserController(userService);

  mainRouter.use("/user", UserRouter(userController));
}

const initWorkspaceRouter = () => {
  const boardRepository = new BoardPrismaRepository();
  const boardService = new BoardService(boardRepository);
  const boardController = new BoardController(boardService);
  const boardRouter = BoardRouter(boardController);

  const workspaceRepository = new WorkspacePrismaRepository();
  const workspaceService = new WorkspaceService(workspaceRepository);
  const workspaceController = new WorkspaceController(workspaceService);

  mainRouter.use("/workspace", WorkspaceRouter(workspaceController, boardRouter));
}

initAuthRouter();
initUserRouter();
initWorkspaceRouter();
export default mainRouter;