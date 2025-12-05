"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateMiddleware = void 0;
const zod_1 = require("zod");
class ZodValidationSchema {
}
const ValidateMiddleware = (zodSchema) => {
    return (req, res, next) => {
        try {
            for (const key in zodSchema) {
                const schema = zodSchema[key];
                schema === null || schema === void 0 ? void 0 : schema.parse(req[key]);
            }
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                res.status(400);
            }
        }
    };
};
exports.ValidateMiddleware = ValidateMiddleware;
