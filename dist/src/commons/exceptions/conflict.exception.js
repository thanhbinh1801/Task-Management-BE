"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictException = void 0;
const exceptions_1 = require("@tsed/exceptions");
const http_status_codes_1 = require("http-status-codes");
class ConflictException extends exceptions_1.ClientException {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.CONFLICT, message || "conflict error");
    }
}
exports.ConflictException = ConflictException;
