"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheckRouter = exports.healthCheckRegistry = void 0;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const commons_1 = require("@/commons");
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const openAPIResponseBuilders_1 = require("../../swagger/openAPIResponseBuilders");
exports.healthCheckRegistry = new zod_to_openapi_1.OpenAPIRegistry();
exports.healthCheckRouter = (() => {
    const router = express_1.default.Router();
    exports.healthCheckRegistry.registerPath({
        method: "get",
        path: "/health-check",
        tags: ["Health Check"],
        responses: (0, openAPIResponseBuilders_1.createApiResponse)(zod_1.z.null(), "Success"),
    });
    router.get("/", (_req, res) => {
        const serviceResponse = new commons_1.ServiceResponse(commons_1.ResponseStatus.Success, "Service is healthy", null, http_status_codes_1.StatusCodes.OK);
        res.status(http_status_codes_1.StatusCodes.OK).json(serviceResponse);
    });
    return router;
})();
