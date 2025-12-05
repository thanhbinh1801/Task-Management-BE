"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiResponse = createApiResponse;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_dto_1 = require("@/commons/dtos/serviceResponse.dto");
function createApiResponse(schema, description, statusCode = http_status_codes_1.StatusCodes.OK) {
    return {
        [statusCode]: {
            description,
            content: {
                'application/json': {
                    schema: (0, serviceResponse_dto_1.ServiceResponseSchema)(schema),
                },
            },
        },
    };
}
