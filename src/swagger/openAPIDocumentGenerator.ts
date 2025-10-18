import { healthCheckRegistry } from "@/modules/healthCheck/healthCheck.router";
import { authRegistry } from "@/modules/auth/auth.route";
import { userRegistry } from "@/modules/user/user.route";
import { workspaceRegistry } from "@/modules/workspace/workspace.route";
import { boardRegistry } from "@/modules/board/board.route";
import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export function generateOpenAPIDocument() {
    const registry = new OpenAPIRegistry([authRegistry, healthCheckRegistry, userRegistry, workspaceRegistry, boardRegistry])
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