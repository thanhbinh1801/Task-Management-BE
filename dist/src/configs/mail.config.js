"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const app_config_1 = require("./app.config");
exports.transporter = nodemailer_1.default.createTransport({
    host: app_config_1.appEnv.SMTP_HOST,
    port: app_config_1.appEnv.SMTP_PORT,
    auth: {
        user: app_config_1.appEnv.SMTP_USER,
        pass: app_config_1.appEnv.SMTP_PASS,
    },
});
