"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpenAPIDocument = generateOpenAPIDocument;
const healthCheck_router_1 = require("@/modules/healthCheck/healthCheck.router");
const auth_route_1 = require("@/modules/auth/auth.route");
const user_route_1 = require("@/modules/user/user.route");
const workspace_route_1 = require("@/modules/workspace/workspace.route");
const member_workspace_route_1 = require("@/modules/workspace/member-workspace/member.workspace.route");
const workspaceJoinLink_route_1 = require("@/modules/workspace/workspace-join-link/workspaceJoinLink.route");
const board_route_1 = require("@/modules/board/board.route");
const boardJoinLink_route_1 = require("@/modules/board/board-join-link/boardJoinLink.route");
const member_board_route_1 = require("@/modules/board/member-board/member.board.route");
const list_route_1 = require("@/modules/list/list.route");
const card_route_1 = require("@/modules/card/card.route");
const joinlink_route_1 = require("@/modules/join-link/joinlink.route");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
function generateOpenAPIDocument() {
    const registry = new zod_to_openapi_1.OpenAPIRegistry([auth_route_1.authRegistry, healthCheck_router_1.healthCheckRegistry, user_route_1.userRegistry,
        workspace_route_1.workspaceRegistry, workspaceJoinLink_route_1.workspaceJoinLinkRegistry, member_workspace_route_1.memberWorkspaceRegistry,
        board_route_1.boardRegistry, boardJoinLink_route_1.boardJoinLinkRegistry, member_board_route_1.memberBoardRegistry,
        list_route_1.listRegistry, card_route_1.cardRegistry, joinlink_route_1.joinLinkRegistry]);
    const generator = new zod_to_openapi_1.OpenApiGeneratorV3(registry.definitions);
    return generator.generateDocument({
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Swagger API',
        },
        externalDocs: {
            description: 'View the raw OpenAPI Specification in JSON format',
            url: '/swagger.json',
        },
    });
}
