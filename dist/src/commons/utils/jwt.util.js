"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("@/configs");
class JwtUtils {
    static signAccess(payload) {
        return jsonwebtoken_1.default.sign(payload, configs_1.appEnv.JWT_SECRET, { expiresIn: "60m" });
    }
    static signRefresh(payload) {
        return jsonwebtoken_1.default.sign(payload, configs_1.appEnv.JWT_SECRET, { expiresIn: "7d" });
    }
    static verifyAccess(token) {
        return jsonwebtoken_1.default.verify(token, configs_1.appEnv.JWT_SECRET);
    }
    static verifyRefresh(token) {
        return jsonwebtoken_1.default.verify(token, configs_1.appEnv.JWT_SECRET);
    }
}
exports.default = JwtUtils;
