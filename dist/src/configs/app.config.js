"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appEnv = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const envalid_1 = require("envalid");
dotenv_1.default.config();
exports.appEnv = (0, envalid_1.cleanEnv)(process.env, {
    NODE_ENV: (0, envalid_1.str)({ devDefault: (0, envalid_1.testOnly)('test'), choices: ['development', 'production', 'test'] }),
    HOST: (0, envalid_1.host)({ devDefault: (0, envalid_1.testOnly)('localhost') }),
    PORT: (0, envalid_1.port)({ devDefault: (0, envalid_1.testOnly)(3000) }),
    CORS_ORIGIN: (0, envalid_1.str)({ devDefault: (0, envalid_1.testOnly)('http://localhost:3000') }),
    DATABASE_URL: (0, envalid_1.str)(),
    // OAuth / JWT
    JWT_SECRET: (0, envalid_1.str)(),
    SESSION_SECRET: (0, envalid_1.str)(),
    GOOGLE_CLIENT_ID: (0, envalid_1.str)({ default: '' }),
    GOOGLE_CLIENT_SECRET: (0, envalid_1.str)({ default: '' }),
    GOOGLE_CALLBACK_URL: (0, envalid_1.str)({ default: 'http://localhost:8000/api/v1/auth/google/callback' }),
    // Send Mail
    SMTP_HOST: (0, envalid_1.str)(),
    SMTP_PORT: (0, envalid_1.num)(),
    SMTP_USER: (0, envalid_1.str)(),
    SMTP_PASS: (0, envalid_1.str)(),
    // Cloudinary
    CLOUDINARY_NAME: (0, envalid_1.str)(),
    CLOUDINARY_KEY: (0, envalid_1.str)(),
    CLOUDINARY_SECRET: (0, envalid_1.str)(),
});
