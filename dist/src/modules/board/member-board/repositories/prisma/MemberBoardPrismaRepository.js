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
const configs_1 = require("@/configs");
const conflict_exception_1 = require("@/commons/exceptions/conflict.exception");
const commons_1 = require("@/commons");
class MemberRepository {
    addMemberBoard(email, boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield configs_1.prisma.board.findUnique({
                where: { id: boardId }
            });
            if (!board) {
                throw new commons_1.NotFoundException('Board does not exist');
            }
            ;
            const userId = yield configs_1.prisma.user.findUnique({
                where: { email }
            });
            if (!userId)
                return null;
            const existingMember = yield configs_1.prisma.boardMember.findUnique({
                where: { userId_boardId: { userId: userId.id, boardId }
                }
            });
            if (existingMember) {
                throw new conflict_exception_1.ConflictException('User is already a member of the board');
            }
            const role = yield configs_1.prisma.role.findFirst({
                where: { roleName: 'MEMBER' }
            });
            if (!role)
                return null;
            return configs_1.prisma.boardMember.create({
                data: {
                    userId: userId.id,
                    boardId: boardId,
                    roleId: (role === null || role === void 0 ? void 0 : role.id) || ''
                }
            });
        });
    }
    getMember(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.boardMember.findMany({
                where: { boardId }
            });
        });
    }
    updateMember(boardId, userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const roleRecord = yield configs_1.prisma.role.findFirst({
                where: { roleName: role }
            });
            if (!roleRecord)
                return null;
            return configs_1.prisma.boardMember.update({
                where: { userId_boardId: { userId, boardId } },
                data: {
                    roleId: (roleRecord === null || roleRecord === void 0 ? void 0 : roleRecord.id) || ''
                }
            });
        });
    }
    removeMember(boardId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.boardMember.delete({
                where: { userId_boardId: { userId, boardId } }
            });
        });
    }
}
exports.default = MemberRepository;
