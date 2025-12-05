"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_util_1 = __importDefault(require("@/commons/utils/jwt.util"));
const commons_1 = require("@/commons");
const authenticate = (schema) => {
    return (req, res, next) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new commons_1.UnauthorizedException("Missing or invalid token");
        }
        try {
            const token = authHeader.split(" ")[1];
            const payload = jwt_util_1.default.verifyAccess(token);
            req.users = {
                userId: payload.userId,
                email: payload.email
            };
        }
        catch (_a) {
            throw new commons_1.UnauthorizedException("Invalid or expired token");
        }
        if (schema) {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: result.error.flatten(),
                });
            }
            req.body = result.data;
        }
        next();
    };
};
exports.authenticate = authenticate;
