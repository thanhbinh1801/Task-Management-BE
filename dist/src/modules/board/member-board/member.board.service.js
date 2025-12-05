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
class MemberBoardService {
    constructor(memberRepo) {
        this.memberRepo = memberRepo;
    }
    addMemberBoardByEmail(email, boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMember = yield this.memberRepo.addMemberBoard(email, boardId);
            if (!newMember) {
                throw new commons_1.InternalServerException("can not add member to board");
            }
            return newMember;
        });
    }
    getMember(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield this.memberRepo.getMember(boardId);
            if (!members) {
                throw new commons_1.InternalServerException("can not get members of board");
            }
            return members;
        });
    }
    updateMember(boardId, userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedMember = yield this.memberRepo.updateMember(boardId, userId, role);
            if (!updatedMember) {
                throw new commons_1.InternalServerException("can not update member of board");
            }
            return updatedMember;
        });
    }
    removeMember(boardId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const removedMember = yield this.memberRepo.removeMember(boardId, userId);
            if (!removedMember) {
                throw new commons_1.InternalServerException("can not remove member of board");
            }
            return removedMember;
        });
    }
}
exports.default = MemberBoardService;
