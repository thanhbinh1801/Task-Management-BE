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
class WorkspaceService {
    constructor(workspaceRepo) {
        this.workspaceRepo = workspaceRepo;
    }
    getWorkspaces(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspaces = yield this.workspaceRepo.findWorkspace(userId);
            if (workspaces.length === 0) {
                throw new commons_1.NotFoundException('not found workspace');
            }
            return workspaces;
        });
    }
    getWorkspaceById(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspace = yield this.workspaceRepo.findWorkspaceById(workspaceId);
            if (!workspace) {
                throw new commons_1.NotFoundException('not found workspace');
            }
            return workspace;
        });
    }
    createWorkspace(dataWorkspace, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newWorkspace = yield this.workspaceRepo.createWorkspace(dataWorkspace, userId);
            if (!newWorkspace) {
                throw new commons_1.InternalServerException('can not create workspace');
            }
            return newWorkspace;
        });
    }
    updateWorkspace(dataWorkspace, workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateWorkspace = yield this.workspaceRepo.updateWorkspace(dataWorkspace, workspaceId);
            if (!updateWorkspace) {
                throw new commons_1.InternalServerException('can not update workspace');
            }
            return updateWorkspace;
        });
    }
    deleteWorkspace(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDelete = yield this.workspaceRepo.deleteWorkspace(workspaceId);
            if (!isDelete) {
                throw new commons_1.InternalServerException('can not delete workspace');
            }
        });
    }
    hardDeleteWorkspace(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDelete = yield this.workspaceRepo.hardDeleteWorkspace(workspaceId);
            if (!isDelete) {
                throw new commons_1.InternalServerException('can not hard delete workspace');
            }
        });
    }
}
exports.default = WorkspaceService;
