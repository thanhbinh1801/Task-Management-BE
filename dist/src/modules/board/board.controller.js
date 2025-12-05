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
Object.defineProperty(exports, "__esModule", { value: true });
const commons_1 = require("@/commons");
const board_request_1 = require("./dtos/requests/board.request");
class BoardController {
    constructor(boardService) {
        this.boardService = boardService;
        this.getBoards = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const workspaceId = req.params.workspaceId;
                if (!workspaceId) {
                    throw new commons_1.BadRequestException("workspaceId not found");
                }
                const boards = yield this.boardService.getBoards(workspaceId);
                res.status(200).json({
                    status: "success",
                    message: "get board successfully",
                    data: boards
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.getBoardById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const boardId = req.params.boardId;
                if (!boardId) {
                    throw new commons_1.BadRequestException("boardId not found");
                }
                const board = yield this.boardService.getBoardById(boardId);
                res.status(200).json({
                    status: "success",
                    message: "get board by id successfully",
                    data: board
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.createBoard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const workspaceId = req.params.workspaceId;
                if (!workspaceId) {
                    throw new commons_1.BadRequestException("workspaceId not found");
                }
                const userId = (_a = req.users) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new commons_1.BadRequestException("userId not found");
                }
                const { nameBoard } = board_request_1.BoardCreateRequestSchema.parse(req.body);
                const boardData = { nameBoard };
                const newBoard = yield this.boardService.createBoard(boardData, workspaceId, userId);
                res.status(201).json({
                    status: "success",
                    message: "create board successfully",
                    data: newBoard
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.updateBoard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const workspaceId = req.params.workspaceId;
                if (!workspaceId) {
                    throw new commons_1.BadRequestException("workspaceId not found");
                }
                const boardId = req.params.boardId;
                if (!boardId) {
                    throw new commons_1.BadRequestException("boardId not found");
                }
                const boardData = board_request_1.BoardUpdateRequestSchema.parse({
                    workspaceId: req.params.workspaceId,
                    boardId: req.params.boardId,
                    nameBoard: (_a = req.body) === null || _a === void 0 ? void 0 : _a.nameBoard,
                });
                const updatedBoard = yield this.boardService.updateBoard(boardData);
                res.status(200).json({
                    status: "success",
                    message: "update board successfully",
                    data: updatedBoard
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.deleteBoard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const boardId = req.params.boardId;
                if (!boardId) {
                    throw new commons_1.BadRequestException("boardId not found");
                }
                // Check if permanent delete is requested via query parameter
                const isPermanent = req.query.permanent === 'true';
                if (isPermanent) {
                    yield this.boardService.hardDeleteBoard(boardId);
                }
                else {
                    yield this.boardService.deleteBoard(boardId);
                }
                res.status(200).json({
                    status: "success",
                    message: isPermanent ? "permanently deleted board successfully" : "soft deleted board successfully",
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = BoardController;
