"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
    if (res.headersSent)
        return next(err);
    const statusCode = err.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: err.message || http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
};
exports.errorHandler = errorHandler;
