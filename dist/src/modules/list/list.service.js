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
exports.ListService = void 0;
const commons_1 = require("@/commons");
class ListService {
    constructor(listRepo) {
        this.listRepo = listRepo;
    }
    getLists(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lists = yield this.listRepo.findLists(boardId);
            if (lists.length === 0) {
                throw new commons_1.NotFoundException("Lists not found");
            }
            return lists;
        });
    }
    getListById(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.listRepo.findListById(listId);
            if (!list) {
                throw new commons_1.NotFoundException("List not found");
            }
            return list;
        });
    }
    createList(listData, boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newList = yield this.listRepo.createList(listData, boardId);
            if (!newList) {
                throw new commons_1.InternalServerException("can not create list");
            }
            return newList;
        });
    }
    updateList(listData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateList = yield this.listRepo.updateList(listData);
            if (!updateList) {
                throw new commons_1.InternalServerException("can not update list");
            }
            return updateList;
        });
    }
    deleteList(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDelete = yield this.listRepo.deleteList(listId);
            if (!isDelete) {
                throw new commons_1.InternalServerException('can not delete list');
            }
        });
    }
    hardDeleteList(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDelete = yield this.listRepo.hardDeleteList(listId);
            if (!isDelete) {
                throw new commons_1.InternalServerException('can not hard delete list');
            }
        });
    }
}
exports.ListService = ListService;
