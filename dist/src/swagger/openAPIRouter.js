"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOpenAPIRouter = buildOpenAPIRouter;
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openAPIDocumentGenerator_js_1 = require("./openAPIDocumentGenerator.js");
function buildOpenAPIRouter() {
    const router = express_1.default.Router();
    const openAPIDocument = (0, openAPIDocumentGenerator_js_1.generateOpenAPIDocument)();
    router.get('/swagger.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(openAPIDocument);
    });
    router.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openAPIDocument, {
        swaggerOptions: {
            persistAuthorization: true
        }
    }));
    return router;
}
