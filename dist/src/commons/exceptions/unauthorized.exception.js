"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = void 0;
const exceptions_1 = require("@tsed/exceptions");
const http_status_codes_1 = require("http-status-codes");
class UnauthorizedException extends exceptions_1.ClientException {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.UNAUTHORIZED, message || "Unauthorized error");
    }
}
exports.UnauthorizedException = UnauthorizedException;
