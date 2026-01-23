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

import { TemplatePrismaRepository } from "@/modules/board-template/repository/TemplatePrismaRepository";
import { TemplateService } from "@/modules/board-template/boardTemplate.service";
import TemplateController from "@/modules/board-template/boardTemplate.controller";
import { TemplateRouter } from "@/modules/board-template/boardTempalte.router";

import WorkspaceJoinLinkRepository from "@/modules/workspace/workspace-join-link/repository/prisma/WorkspaceJoinLinkPrismaRepository";
import WorkspaceJoinLinkService from "@/modules/workspace/workspace-join-link/workspaceJoinLink.service";
import WorkspaceJoinLinkController from "@/modules/workspace/workspace-join-link/workspaceJoinLink.controller";
import { WorkspaceJoinLinkRouter } from "@/modules/workspace/workspace-join-link/workspaceJoinLink.route";

import MemberWorkspaceController from "@/modules/workspace/member-workspace/member.workspace.controller";
import MemberWorkspaceService from "@/modules/workspace/member-workspace/member.workspace.service";
import MemberWorkspaceRepository from "@/modules/workspace/member-workspace/repositories/prisma/MemberPrismaRepository";
import { MemberWorkspaceRouter } from "@/modules/workspace/member-workspace/member.workspace.route";

import BoardJoinLinkRepository from "@/modules/board/board-join-link/repositories/prisma/BoardJoinLinkPrismaRepository";
import BoardJoinLinkService from "@/modules/board/board-join-link/boardJoinLink.service";
import BoardJoinLinkController from "@/modules/board/board-join-link/boardJoinLink.controller";
import { BoardJoinLinkRouter } from "@/modules/board/board-join-link/boardJoinLink.route";

import MemberBoardRepository from "@/modules/board/member-board/repositories/prisma/MemberBoardPrismaRepository";
import MemberBoardController from "@/modules/board/member-board/member.board.controller";
import MemberBoardService from "@/modules/board/member-board/member.board.service";
import { MemberBoardRouter } from "@/modules/board/member-board/member.board.route";

import { ListPrismaRepository } from "@/modules/list/repository/prisma/ListPrismaRepository";
import { ListService } from "@/modules/list/list.service";
import ListController from "@/modules/list/list.controller";
import { ListRouter } from "@/modules/list/list.route";

import { CardRouter } from "@/modules/card/card.route";
import CardController from "@/modules/card/card.controller";
import { CardService } from "@/modules/card/card.service";
import { CardPrismaRepository } from "@/modules/card/repository/prisma/CardPrismaRepository";

import { BoardLabelRouter, CardLabelRouter } from "@/modules/label/label.route";
import LabelController from "@/modules/label/label.controller";
import { LabelService } from "@/modules/label/label.service";
import { LabelPrismaRepository } from "@/modules/label/repository/prisma/LabelPrismaRepository";

import JoinLinkRouter from "@/modules/join-link/joinlink.route";
import JoinLinkController from "@/modules/join-link/joinlink.controller";
import JoinLinkService from "@/modules/join-link/joinlink.service";
import JoinLinkRepository from "@/modules/join-link/repositories/prisma/JoinLinkPrismaRepository";


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

const initCardRouter = () => {
  const cardRepository = new CardPrismaRepository();
  const cardService = new CardService(cardRepository);
  const cardController = new CardController(cardService);

  return CardRouter(cardController);
}

const initListRouter = () => {
  const cardRouter = initCardRouter();
  
  const listRepository = new ListPrismaRepository();
  const listService = new ListService(listRepository);
  const listController = new ListController(listService);
  const listRouter = ListRouter(listController, cardRouter);

  return listRouter;
}

const initBoardRouter = () => {
  const listRouter = initListRouter();

  const labelRepository = new LabelPrismaRepository();
  const labelService = new LabelService(labelRepository);
  const labelController = new LabelController(labelService);
  const boardLabelRouter = BoardLabelRouter(labelController);
  const cardLabelRouter = CardLabelRouter(labelController);

  const boardJoinLinkRepository = new BoardJoinLinkRepository();
  const boardJoinLinkService = new BoardJoinLinkService(boardJoinLinkRepository);
  const boardJoinLinkController = new BoardJoinLinkController(boardJoinLinkService);
  const boardJoinLinkRouter = BoardJoinLinkRouter(boardJoinLinkController);

  const memberBoardRepository = new MemberBoardRepository();
  const memberBoardService = new MemberBoardService(memberBoardRepository);
  const memberBoardController = new MemberBoardController(memberBoardService);
  const memberBoardRouter = MemberBoardRouter(memberBoardController);

  const templateRepository = new TemplatePrismaRepository();
  const boardRepository = new BoardPrismaRepository();
  const boardService = new BoardService(boardRepository, templateRepository);
  const boardController = new BoardController(boardService);
  const boardRouter = BoardRouter(boardController, memberBoardRouter, boardJoinLinkRouter, listRouter, boardLabelRouter, cardLabelRouter);

  return boardRouter;
}

const initTemplateRouter = () => {
  const templateRepository = new TemplatePrismaRepository();
  const templateService = new TemplateService(templateRepository);
  const templateController = new TemplateController(templateService);

  mainRouter.use("/templates", TemplateRouter(templateController));
}

const initWorkspaceRouter = () => {
  const boardRouter = initBoardRouter();
  
  //workspace router dependencies
  const workspaceJoinLinkRepository = new WorkspaceJoinLinkRepository();
  const workspaceJoinLinkService = new WorkspaceJoinLinkService(workspaceJoinLinkRepository);
  const workspaceJoinLinkController = new WorkspaceJoinLinkController(workspaceJoinLinkService);
  const workspaceJoinLinkRouter = WorkspaceJoinLinkRouter(workspaceJoinLinkController);

  const memberWorkspaceRepository = new MemberWorkspaceRepository();
  const memberWorkspaceService = new MemberWorkspaceService(memberWorkspaceRepository);
  const memberWorkspaceController = new MemberWorkspaceController(memberWorkspaceService);
  const memberWorkspaceRouter = MemberWorkspaceRouter(memberWorkspaceController);

  const workspaceRepository = new WorkspacePrismaRepository();
  const workspaceService = new WorkspaceService(workspaceRepository);
  const workspaceController = new WorkspaceController(workspaceService);


  mainRouter.use("/workspace", WorkspaceRouter(workspaceController, workspaceJoinLinkRouter, memberWorkspaceRouter, boardRouter));
}

const initjoinLinkRouter = () => {
  const memberWorkspaceRepository = new MemberWorkspaceRepository();
  const memberWorkspaceService = new MemberWorkspaceService(memberWorkspaceRepository);
  const memberBoardRepository = new MemberBoardRepository();
  const memberBoardService = new MemberBoardService(memberBoardRepository);

  const joinLinkRepository = new JoinLinkRepository();
  const joinLinkService = new JoinLinkService(joinLinkRepository, memberWorkspaceService, memberBoardService);
  const joinLinkController = new JoinLinkController(joinLinkService);
  mainRouter.use("/invite", JoinLinkRouter(joinLinkController));
}

initAuthRouter();
initUserRouter();
initTemplateRouter();
initWorkspaceRouter();
initjoinLinkRouter();
export default mainRouter;