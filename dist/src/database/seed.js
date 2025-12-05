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
const prisma_1 = require("../configs/prisma");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma_1.prisma.permission.createMany({
            data: [
                // workspace
                { permissionName: 'CREATE_WORKSPACE', description: 'create workspace' },
                { permissionName: 'VIEW_WORKSPACE', description: 'view workspace' },
                { permissionName: 'UPDATE_WORKSPACE', description: 'change visibility of workspace' },
                { permissionName: 'DELETE_WORKSPACE', description: 'delete workspace' },
                // board
                { permissionName: 'CREATE_BOARD', description: 'create board' },
                { permissionName: 'VIEW_BOARD', description: 'view board' },
                { permissionName: 'UPDATE_BOARD', description: 'update information of board' },
                { permissionName: 'DELETE_BOARD', description: 'delete board' },
                // card
                { permissionName: 'CREATE_CARD', description: 'create card' },
                { permissionName: 'VIEW_CARD', description: 'view card' },
                { permissionName: 'UPDATE_CARD', description: 'update information of card' },
                { permissionName: 'DELETE_CARD', description: 'delete card' },
                // list
                { permissionName: 'CREATE_LIST', description: 'create list' },
                { permissionName: 'VIEW_LIST', description: 'view list' },
                { permissionName: 'UPDATE_LIST', description: 'update information of list' },
                { permissionName: 'DELETE_LIST', description: 'delete list' },
                // member
                { permissionName: 'ADD_MEMBER', description: "add member to workspace or board" },
                { permissionName: 'VIEW_MEMBER', description: "view member in workspace or board" },
                { permissionName: 'CHANGE_MEMBER_PERMISSION', description: 'change user permission' },
                { permissionName: 'REMOVE_MEMBER', description: 'remove member over workspace or board' },
                //join-link
                { permissionName: 'MANAGE_JOIN_LINK', description: 'manage join link' },
            ],
            skipDuplicates: true,
        });
        const [admin, OwnerWorkspace, OwnerBoard, MemberWorkspace, MemberBoard] = yield Promise.all([
            prisma_1.prisma.role.upsert({
                where: { roleName: 'Admin' },
                update: {},
                create: { roleName: 'Admin', description: 'users have all permissions of system' }
            }),
            prisma_1.prisma.role.upsert({
                where: { roleName: 'OwnerWorkspace' },
                update: {},
                create: { roleName: 'OwnerWorkspace', description: 'users have certain permissions of workspace' }
            }),
            prisma_1.prisma.role.upsert({
                where: { roleName: 'OwnerBoard' },
                update: {},
                create: { roleName: 'OwnerBoard', description: 'users have certain permissions of board' }
            }),
            prisma_1.prisma.role.upsert({
                where: { roleName: 'MemberWorkspace' },
                update: {},
                create: { roleName: 'MemberWorkspace', description: 'users have permissions of card, list' }
            }),
            prisma_1.prisma.role.upsert({
                where: { roleName: 'MemberBoard' },
                update: {},
                create: { roleName: 'MemberBoard', description: 'users have permissions of card, list' }
            })
        ]);
        const allPermissions = yield prisma_1.prisma.permission.findMany();
        const adminPermissions = allPermissions.filter(p => ['VIEW_WORKSPACE', 'UPDATE_WORKSPACE', 'DELETE_WORKSPACE', 'CREATE_BOARD', 'VIEW_BOARD', 'UPDATE_BOARD', 'DELETE_BOARD',
            'CREATE_CARD', 'VIEW_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'CREATE_LIST', 'VIEW_LIST', 'UPDATE_LIST',
            'ADD_MEMBER', 'VIEW_MEMBER', 'CHANGE_MEMBER_PERMISSION', 'REMOVE_MEMBER', 'MANAGE_JOIN_LINK'
        ].includes(p.permissionName));
        const ownerWorkspacePermissions = allPermissions.filter(p => ['VIEW_WORKSPACE', 'UPDATE_WORKSPACE', 'DELETE_WORKSPACE', 'CREATE_BOARD', 'VIEW_BOARD', 'UPDATE_BOARD', 'DELETE_BOARD',
            'CREATE_CARD', 'VIEW_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'CREATE_LIST', 'VIEW_LIST', 'UPDATE_LIST',
            'ADD_MEMBER', 'VIEW_MEMBER', 'CHANGE_MEMBER_PERMISSION', 'REMOVE_MEMBER', 'MANAGE_JOIN_LINK'
        ].includes(p.permissionName));
        const ownerBoardPermissions = allPermissions.filter(p => ['VIEW_BOARD', 'UPDATE_BOARD', 'DELETE_BOARD',
            'CREATE_CARD', 'VIEW_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'CREATE_LIST', 'VIEW_LIST', 'UPDATE_LIST',
            'ADD_MEMBER', 'VIEW_MEMBER', 'CHANGE_MEMBER_PERMISSION', 'REMOVE_MEMBER', 'MANAGE_JOIN_LINK'
        ].includes(p.permissionName));
        const memberWorkspacePermissions = allPermissions.filter(p => ['VIEW_WORKSPACE', 'CREATE_BOARD', 'VIEW_BOARD', 'UPDATE_BOARD', 'DELETE_BOARD',
            'CREATE_CARD', 'VIEW_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'CREATE_LIST', 'VIEW_LIST', 'UPDATE_LIST',
            'ADD_MEMBER', 'VIEW_MEMBER', 'MANAGE_JOIN_LINK'
        ].includes(p.permissionName));
        const memberBoardPermissions = allPermissions.filter(p => ['VIEW_BOARD', 'UPDATE_BOARD',
            'CREATE_CARD', 'VIEW_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'CREATE_LIST', 'VIEW_LIST', 'UPDATE_LIST',
            'ADD_MEMBER', 'VIEW_MEMBER', 'MANAGE_JOIN_LINK'
        ].includes(p.permissionName));
        for (const p of adminPermissions) {
            yield prisma_1.prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: admin.id, permissionId: p.id } },
                update: {},
                create: { roleId: admin.id, permissionId: p.id }
            });
        }
        for (const p of ownerWorkspacePermissions) {
            yield prisma_1.prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: OwnerWorkspace.id, permissionId: p.id } },
                update: {},
                create: { roleId: OwnerWorkspace.id, permissionId: p.id }
            });
        }
        for (const p of ownerBoardPermissions) {
            yield prisma_1.prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: OwnerBoard.id, permissionId: p.id } },
                update: {},
                create: { roleId: OwnerBoard.id, permissionId: p.id }
            });
        }
        for (const p of memberWorkspacePermissions) {
            yield prisma_1.prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: MemberWorkspace.id, permissionId: p.id } },
                update: {},
                create: { roleId: MemberWorkspace.id, permissionId: p.id }
            });
        }
        for (const p of memberBoardPermissions) {
            yield prisma_1.prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: MemberBoard.id, permissionId: p.id } },
                update: {},
                create: { roleId: MemberBoard.id, permissionId: p.id }
            });
        }
        console.log('RBAC seed completed successfully!');
    });
}
main()
    .catch(err => console.error(err))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma_1.prisma.$disconnect(); }));
