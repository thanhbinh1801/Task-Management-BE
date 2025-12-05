"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinLinkRegistry = void 0;
exports.default = JoinLinkRouter;
const commons_1 = require("@/commons");
const express_1 = require("express");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const swagger_1 = require("@/swagger");
const zod_1 = __importDefault(require("zod"));
exports.joinLinkRegistry = new zod_to_openapi_1.OpenAPIRegistry();
// joinLinkRegistry.registerPath({
//   path: '/api/v1/invite/{token}/preview',
//   method: "get",
//   tags: ["Join-Link"],
//   security: [{ bearerAuth: [] }],
//   request: {
//     params: z.object({
//       token: z.string(),
//     })
//   },
//   responses: createApiResponse(z.null() , "Success"),
// });
exports.joinLinkRegistry.registerPath({
    path: '/api/v1/invite/{token}',
    method: "post",
    tags: ["Join-Link"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_1.default.object({
            token: zod_1.default.string(),
        })
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Success"),
});
function JoinLinkRouter(joinLinkController) {
    const joinLinkRouter = (0, express_1.Router)();
    // joinLinkRouter.get("/:token/preview", asyncHandler(authenticate()), asyncHandler(joinLinkController.checkToken));
    joinLinkRouter.post("/:token", (0, commons_1.asyncHandler)((0, commons_1.authenticate)()), (0, commons_1.asyncHandler)(joinLinkController.join));
    return joinLinkRouter;
}
