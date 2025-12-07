"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("zod");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const openAPIRouter_1 = require("./swagger/openAPIRouter");
const configs_1 = require("./configs");
const index_router_1 = __importDefault(require("./commons/router/index.router"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const healthCheck_router_1 = require("./modules/healthCheck/healthCheck.router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_handler_1 = require("./commons/exceptions/error.handler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Set the application to trust the reverse proxy
app.set("trust proxy", true);
// Middlewares
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: configs_1.appEnv.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: configs_1.appEnv.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/health-check", healthCheck_router_1.healthCheckRouter);
app.use('/api/v1', index_router_1.default);
app.get("/", (_req, res) => {
    res.send('<a href="/api/v1/auth/google">Login with Google</a>');
});
app.use((0, openAPIRouter_1.buildOpenAPIRouter)());
app.use(error_handler_1.errorHandler);
app.listen(configs_1.appEnv.PORT, () => {
    const { NODE_ENV, HOST, PORT } = configs_1.appEnv;
    console.log(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});
