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
const workspace_request_1 = require("./dtos/requests/workspace.request");
const commons_1 = require("@/commons");
class WorkspaceController {
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
        this.getWorkspaces = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.users) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new commons_1.BadRequestException(' user id not found');
                }
                const allWorkspace = yield this.workspaceService.getWorkspaces(userId);
                res.status(200).json({
                    status: "success",
                    message: "get workspace successfully",
                    data: allWorkspace
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.getWorkspaceById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const workspaceId = req.params.workspaceId;
                const workspace = yield this.workspaceService.getWorkspaceById(workspaceId);
                res.status(200).json({
                    status: "success",
                    message: "get workspace by id successfully",
                    data: workspace
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.createWorkspace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.users) === null || _a === void 0 ? void 0 : _a.userId;
                const dataWorkspace = workspace_request_1.WorkspaceCreateRequestSchema.parse(req.body);
                if (!dataWorkspace) {
                    throw new commons_1.BadRequestException('data workspace not found');
                }
                const newWorkspace = yield this.workspaceService.createWorkspace(dataWorkspace, userId);
                res.status(201).json({
                    status: "success",
                    message: "create workspace successfully",
                    data: newWorkspace
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.updateWorkspace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const workspaceId = req.params.workspaceId;
                const dataWorkspace = workspace_request_1.WorkspaceUpdateRequestSchema.parse(req.body);
                if (!dataWorkspace) {
                    throw new commons_1.BadRequestException('data workspace not found');
                }
                const updateWorkspace = yield this.workspaceService.updateWorkspace(dataWorkspace, workspaceId);
                res.status(200).json({
                    status: "success",
                    message: "update workspace successfully",
                    data: updateWorkspace
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.deleteWorkspace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const workspaceId = req.params.workspaceId;
                if (!workspaceId) {
                    throw new commons_1.BadRequestException(' workspace id not found');
                }
                // Check if permanent delete is requested via query parameter
                const isPermanent = req.query.permanent === 'true';
                if (isPermanent) {
                    yield this.workspaceService.hardDeleteWorkspace(workspaceId);
                }
                else {
                    yield this.workspaceService.deleteWorkspace(workspaceId);
                }
                res.status(200).json({
                    status: "success",
                    message: isPermanent ? "permanently deleted workspace successfully" : "soft deleted workspace successfully",
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = WorkspaceController;
