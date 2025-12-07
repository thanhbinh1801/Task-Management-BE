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
class MemberWorkspaceController {
    constructor(memberService) {
        this.memberService = memberService;
        this.addMemberWorkspaceByEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const workspaceId = req.params.workspaceId;
                if (!workspaceId) {
                    throw new commons_1.BadRequestException(' workspace id not found');
                }
                const email = req.body.emailUser;
                if (!email) {
                    throw new commons_1.BadRequestException(' email not found');
                }
                const newMember = yield this.memberService.addMemberWorkspaceByEmail(email, workspaceId);
                res.status(201).json({
                    status: "success",
                    message: "add workspace member successfully",
                    json: newMember
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.viewMemberWorkspace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const workspaceId = req.params.workspaceId;
                if (!workspaceId) {
                    throw new commons_1.BadRequestException(' workspace id not found');
                }
                const allMembers = yield this.memberService.getMember(workspaceId);
                res.status(200).json({
                    status: "success",
                    message: "get all workspace member successfully",
                    json: allMembers
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.changePermissionMemberWorkspace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const workspaceId = req.params.workspaceId;
                if (!workspaceId) {
                    throw new commons_1.BadRequestException(' workspace id not found');
                }
                const userId = (_a = req.users) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new commons_1.BadRequestException(' userId id not found');
                }
                const role = req.body.role;
                if (!role) {
                    throw new commons_1.BadRequestException(' role not found');
                }
                const updateMember = yield this.memberService.updateMember(workspaceId, userId, role);
                res.status(200).json({
                    status: "success",
                    message: "change permission workspace member successfully",
                    json: updateMember
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.removeMemberWorkspace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const workspaceId = req.params.workspaceId;
                if (!workspaceId) {
                    throw new commons_1.BadRequestException(' workspace id not found');
                }
                const userId = (_a = req.users) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new commons_1.BadRequestException(' userId id not found');
                }
                const removeMember = yield this.memberService.removeMember(workspaceId, userId);
                res.status(200).json({
                    status: "success",
                    message: "remove workspace member successfully",
                    json: removeMember
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = MemberWorkspaceController;
