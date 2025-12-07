"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modules = exports.Registries = void 0;
const healthCheck_router_1 = require("./healthCheck/healthCheck.router");
exports.Registries = [healthCheck_router_1.healthCheckRegistry];
exports.Modules = {
    healthCheckRouter: healthCheck_router_1.healthCheckRouter,
};
