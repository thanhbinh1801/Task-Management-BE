import { Router } from "express";
import { asyncHandler, authenticate } from "@/commons";
import TemplateController from "./boardTemplate.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";

export const templateRegistry = new OpenAPIRegistry();

templateRegistry.registerPath({
    path: '/api/v1/templates',
    method: "get",
    tags: ["System Templates"],
    security: [{ bearerAuth: [] }],
    responses: createApiResponse(z.null(), "Success"),
});

templateRegistry.registerPath({
    path: '/api/v1/templates/{templateId}',
    method: "get",
    tags: ["System Templates"],
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            templateId: z.string()
        })
    },
    responses: createApiResponse(z.null(), "Success"),
});

templateRegistry.registerPath({
    path: '/api/v1/templates/category/{category}',
    method: "get",
    tags: ["System Templates"],
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            category: z.string()
        })
    },
    responses: createApiResponse(z.null(), "Success"),
});

export function TemplateRouter(templateController: TemplateController): Router {
    const router = Router();

    router.get('/',
        asyncHandler(authenticate()),
        asyncHandler(templateController.getAllTemplates)
    );

    router.get('/:templateId',
        asyncHandler(authenticate()),
        asyncHandler(templateController.getTemplateById)
    );

    router.get('/category/:category',
        asyncHandler(authenticate()),
        asyncHandler(templateController.getTemplatesByCategory)
    );

    return router;
}