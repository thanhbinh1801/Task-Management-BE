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
exports.authorize = void 0;
const configs_1 = require("@/configs");
const exceptions_1 = require("../exceptions");
const authorize = (requiredPermissions, scope) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.users) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized error" });
            }
            if (scope === "global") {
                // TODO: nếu bạn có RBAC global thì kiểm tra ở đây; 
                return next();
            }
            const workspaceId = req.params.workspaceId;
            console.log("workspaceId: ", workspaceId);
            const boardId = req.params.boardId;
            console.log("boardId: ", boardId);
            if (!workspaceId && scope === "workspace") {
                throw new exceptions_1.BadRequestException("Missing workspaceId in params");
            }
            if (!boardId && scope === "board") {
                throw new exceptions_1.BadRequestException("Missing boardId in params");
            }
            let membership;
            if (scope == "workspace") {
                membership = yield configs_1.prisma.workspaceMember.findUnique({
                    where: { userId_workspaceId: { userId: userId, workspaceId: workspaceId } },
                    select: {
                        role: {
                            select: {
                                RolePermission: {
                                    select: { permission: { select: { permissionName: true } } }
                                }
                            }
                        }
                    }
                });
            }
            else {
                membership = yield configs_1.prisma.boardMember.findUnique({
                    where: { userId_boardId: { userId: userId, boardId: boardId } },
                    select: {
                        role: {
                            select: {
                                RolePermission: {
                                    select: { permission: { select: { permissionName: true } } }
                                }
                            }
                        }
                    }
                });
            }
            if (!membership) {
                return res.status(403).json({ message: "Forbidden: not a member" });
            }
            const permissionSet = new Set(membership.role.RolePermission.map(rp => rp.permission.permissionName));
            console.log('[authorize] required:', requiredPermissions);
            console.log('[authorize] userPerms:', Array.from(permissionSet));
            const isPermitted = requiredPermissions.every(p => permissionSet.has(p));
            if (!isPermitted)
                return res.status(403).json({ message: "Forbidden: missing permission" });
            return next();
        }
        catch (err) {
            console.error("[authorize] error:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
};
exports.authorize = authorize;
