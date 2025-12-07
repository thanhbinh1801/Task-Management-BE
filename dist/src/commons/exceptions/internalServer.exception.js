"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerException = void 0;
const exceptions_1 = require("@tsed/exceptions");
const http_status_codes_1 = require("http-status-codes");
class InternalServerException extends exceptions_1.ServerException {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message || "Error from the server");
    }
}
exports.InternalServerException = InternalServerException;
