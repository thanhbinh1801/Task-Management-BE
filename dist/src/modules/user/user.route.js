"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegistry = void 0;
exports.UserRouter = UserRouter;
const express_1 = require("express");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const async_handler_1 = require("@/commons/middlewares/async.handler");
const commons_1 = require("@/commons");
const user_query_1 = require("./dtos/requests/user.query");
const swagger_1 = require("@/swagger");
const responses_1 = require("./dtos/responses");
const requests_1 = require("./dtos/requests");
const cloudinary_config_1 = require("@/configs/cloudinary.config");
const zod_1 = __importDefault(require("zod"));
exports.userRegistry = new zod_to_openapi_1.OpenAPIRegistry();
exports.userRegistry.registerPath({
    path: "/api/v1/user/",
    method: "get",
    tags: ["User"],
    request: {
        query: user_query_1.GetUserQuerySchema,
    },
    responses: (0, swagger_1.createApiResponse)(responses_1.UserPaginationResponseSchema, "Get users success")
});
exports.userRegistry.registerPath({
    path: "/api/v1/user/{id}",
    method: "get",
    tags: ["User"],
    request: {
        params: requests_1.UserIdSchema
    },
    responses: (0, swagger_1.createApiResponse)(responses_1.UserResponseSchema, "Get user by id successfully")
});
exports.userRegistry.registerPath({
    path: "/api/v1/user/{id}",
    method: "put",
    tags: ["User"],
    request: {
        params: requests_1.UserIdSchema,
        body: {
            content: {
                "application/json": {
                    schema: requests_1.UserUpdateRequestSchema,
                    example: {
                        name: "Thanh Tung",
                        email: "thanhtung@gmail.com",
                        status: "ACTIVE"
                    },
                }
            }
        }
    },
    responses: (0, swagger_1.createApiResponse)(responses_1.UserResponseSchema, "Update user successfully")
});
exports.userRegistry.registerPath({
    path: "/api/v1/user/{id}/avatar",
    method: "put",
    tags: ["User"],
    request: {
        params: requests_1.UserIdSchema,
        body: {
            content: {
                "multipart/form-data": {
                    schema: zod_1.default.object({
                        avatar: zod_1.default.string().openapi({
                            type: "string",
                            format: "binary",
                        }),
                    }),
                }
            }
        }
    },
    responses: (0, swagger_1.createApiResponse)(zod_1.default.null(), "Update avatar user successfully")
});
function UserRouter(userController) {
    const userRouter = (0, express_1.Router)();
    userRouter.get('/', commons_1.PaginationMiddleware, (0, async_handler_1.asyncHandler)(userController.getUsers));
    userRouter.get('/:id', (0, async_handler_1.asyncHandler)(userController.getUserById));
    userRouter.post('/', (0, async_handler_1.asyncHandler)(userController.createUser));
    userRouter.put('/:id', (0, async_handler_1.asyncHandler)(userController.updateUser));
    userRouter.put('/:id/avatar', cloudinary_config_1.upload.single('avatar'), (0, async_handler_1.asyncHandler)(userController.updateAvatarUser));
    return userRouter;
}
