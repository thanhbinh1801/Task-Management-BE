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
exports.BoardService = void 0;
const commons_1 = require("@/commons");
class BoardService {
    constructor(boardRepo) {
        this.boardRepo = boardRepo;
    }
    getBoards(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const boards = yield this.boardRepo.findBoards(workspaceId);
            if (boards.length === 0) {
                throw new commons_1.NotFoundException("Boards not found");
            }
            return boards;
        });
    }
    getBoardById(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield this.boardRepo.findBoardById(boardId);
            if (!board) {
                throw new commons_1.NotFoundException("Board not found");
            }
            return board;
        });
    }
    createBoard(boardData, workspaceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBoard = yield this.boardRepo.createBoard(boardData, workspaceId, userId);
            if (!newBoard) {
                throw new commons_1.InternalServerException("can not create board");
            }
            return newBoard;
        });
    }
    updateBoard(boardData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateBoard = yield this.boardRepo.updateBoard(boardData);
            if (!updateBoard) {
                throw new commons_1.InternalServerException("can not update board");
            }
            return updateBoard;
        });
    }
    deleteBoard(boarId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDelete = yield this.boardRepo.deleteBoard(boarId);
            if (!isDelete) {
                throw new commons_1.InternalServerException('can not delete board');
            }
        });
    }
    hardDeleteBoard(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDelete = yield this.boardRepo.hardDeleteBoard(boardId);
            if (!isDelete) {
                throw new commons_1.InternalServerException('can not hard delete board');
            }
        });
    }
}
exports.BoardService = BoardService;
