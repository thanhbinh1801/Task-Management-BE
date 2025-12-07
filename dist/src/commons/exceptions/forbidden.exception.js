"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = void 0;
const exceptions_1 = require("@tsed/exceptions");
const http_status_codes_1 = require("http-status-codes");
class ForbiddenException extends exceptions_1.ClientException {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.FORBIDDEN, message || "Forbidden error");
    }
}
exports.ForbiddenException = ForbiddenException;
