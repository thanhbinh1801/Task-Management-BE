"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const exceptions_1 = require("@tsed/exceptions");
const http_status_codes_1 = require("http-status-codes");
class NotFoundException extends exceptions_1.ClientException {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.NOT_FOUND, message || "Not found error");
    }
}
exports.NotFoundException = NotFoundException;
