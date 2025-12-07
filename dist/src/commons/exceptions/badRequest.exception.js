"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const exceptions_1 = require("@tsed/exceptions");
const http_status_codes_1 = require("http-status-codes");
class BadRequestException extends exceptions_1.ClientException {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.BAD_REQUEST, message || "Error from the server");
    }
}
exports.BadRequestException = BadRequestException;
