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
const list_request_1 = require("./dtos/requests/list.request");
class ListController {
    constructor(listService) {
        this.listService = listService;
        this.getLists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const boardId = req.params.boardId;
                if (!boardId) {
                    throw new commons_1.BadRequestException("boardId not found");
                }
                const lists = yield this.listService.getLists(boardId);
                res.status(200).json({
                    status: "success",
                    message: "get lists successfully",
                    data: lists
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.getListById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const boardId = req.params.boardId;
                const listId = req.params.listId;
                if (!boardId) {
                    throw new commons_1.BadRequestException("boardId not found");
                }
                const list = yield this.listService.getListById(listId);
                res.status(200).json({
                    status: "success",
                    message: "get list by id successfully",
                    data: list
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.createList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const boardId = req.params.boardId;
                if (!boardId) {
                    throw new commons_1.BadRequestException("boardId not found");
                }
                const { nameList } = list_request_1.ListCreateRequestSchema.parse(req.body);
                const listData = { nameList };
                const newList = yield this.listService.createList(listData, boardId);
                res.status(201).json({
                    status: "success",
                    message: "create list successfully",
                    data: newList
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.updateList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const boardId = req.params.boardId;
                if (!boardId) {
                    throw new commons_1.BadRequestException("boardId not found");
                }
                const listId = req.params.listId;
                if (!listId) {
                    throw new commons_1.BadRequestException("listId not found");
                }
                if (!req.body) {
                    throw new commons_1.BadRequestException("data of request body not found");
                }
                const listData = list_request_1.ListUpdateRequestSchema.parse({
                    listId: listId,
                    boardId: boardId,
                    nameList: (_a = req.body) === null || _a === void 0 ? void 0 : _a.nameList,
                    leftId: (_b = req.body) === null || _b === void 0 ? void 0 : _b.leftIndex,
                    rightId: (_c = req.body) === null || _c === void 0 ? void 0 : _c.rightIndex,
                });
                const updatedList = yield this.listService.updateList(listData);
                res.status(200).json({
                    status: "success",
                    message: "update list successfully",
                    data: updatedList
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.deleteList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const listId = req.params.listId;
                if (!listId) {
                    throw new commons_1.BadRequestException("listId not found");
                }
                // Check if permanent delete is requested via query parameter
                const isPermanent = req.query.permanent === 'true';
                if (isPermanent) {
                    yield this.listService.hardDeleteList(listId);
                }
                else {
                    yield this.listService.deleteList(listId);
                }
                res.status(200).json({
                    status: "success",
                    message: isPermanent ? "permanently deleted list successfully" : "soft deleted list successfully",
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = ListController;
