import { healthCheckRegistry } from "@/modules/healthCheck/healthCheck.router";
import { authRegistry } from "@/modules/auth/auth.route";
import { userRegistry } from "@/modules/user/user.route";
import { workspaceRegistry } from "@/modules/workspace/workspace.route";
import { memberWorkspaceRegistry } from "@/modules/workspace/member-workspace/member.workspace.route";
import { workspaceJoinLinkRegistry } from "@/modules/workspace/workspace-join-link/workspaceJoinLink.route";

import { boardRegistry } from "@/modules/board/board.route";
import { boardJoinLinkRegistry } from "@/modules/board/board-join-link/boardJoinLink.route";
import { memberBoardRegistry } from "@/modules/board/member-board/member.board.route";

import { listRegistry } from "@/modules/list/list.route";
import { cardRegistry } from "@/modules/card/card.route";

import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export function generateOpenAPIDocument() {
    const registry = new OpenAPIRegistry(
        [authRegistry, healthCheckRegistry, userRegistry, 
        workspaceRegistry, workspaceJoinLinkRegistry, memberWorkspaceRegistry, 
        boardRegistry, boardJoinLinkRegistry, memberBoardRegistry,
        listRegistry, cardRegistry]
    );
    const generator = new OpenApiGeneratorV3(registry.definitions)

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
    })
}