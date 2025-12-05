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
const notFound_exception_1 = require("@/commons/exceptions/notFound.exception");
const commons_1 = require("@/commons");
class MemberWorkspaceRepository {
    addMemberWorkspace(email, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspace = yield configs_1.prisma.workspace.findUnique({
                where: { id: workspaceId }
            });
            if (!workspace) {
                throw new notFound_exception_1.NotFoundException('Workspace not found');
            }
            const userId = yield configs_1.prisma.user.findUnique({
                where: { email }
            });
            if (!userId)
                return null;
            const existingMember = yield configs_1.prisma.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: { userId: userId.id, workspaceId }
                }
            });
            if (existingMember) {
                throw new commons_1.ConflictException('User is already a member of the workspace');
            }
            const role = yield configs_1.prisma.role.findFirst({
                where: { roleName: 'MemberWorkspace' }
            });
            if (!role) {
                throw new commons_1.BadRequestException('Role not found');
            }
            return configs_1.prisma.workspaceMember.create({
                data: {
                    userId: userId.id,
                    workspaceId: workspaceId,
                    roleId: (role === null || role === void 0 ? void 0 : role.id) || ''
                }
            });
        });
    }
    getMember(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.workspaceMember.findMany({
                where: { workspaceId }
            });
        });
    }
    updateMember(workspaceId, userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const roleRecord = yield configs_1.prisma.role.findFirst({
                where: { roleName: role }
            });
            if (!roleRecord)
                return null;
            return configs_1.prisma.workspaceMember.update({
                where: { userId_workspaceId: { userId, workspaceId } },
                data: {
                    roleId: (roleRecord === null || roleRecord === void 0 ? void 0 : roleRecord.id) || ''
                }
            });
        });
    }
    removeMember(workspaceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return configs_1.prisma.workspaceMember.delete({
                where: { userId_workspaceId: { userId, workspaceId } }
            });
        });
    }
}
exports.default = MemberWorkspaceRepository;
