import { Router} from "express";
import  UserController from "./user.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { asyncHandler } from "@/commons/middlewares/async.handler";
import { PaginationMiddleware } from "@/commons";
import { GetUserQuerySchema } from "./dtos/requests/user.query";
import { createApiResponse } from "@/swagger";
import { UserPaginationResponseSchema, UserResponseSchema } from "./dtos/responses";
import { UserIdSchema, UserUpdateRequestSchema } from "./dtos/requests";
import { upload } from "@/configs/cloudinary.config";
import z from "zod";

export const userRegistry = new OpenAPIRegistry();

userRegistry.registerPath({
  path: "/api/v1/user/",
  method: "get",
  tags: ["User"],
  request: {
    query: GetUserQuerySchema,
  },
  responses: createApiResponse(UserPaginationResponseSchema, "Get users success")
});

userRegistry.registerPath({
  path: "/api/v1/user/{id}",
  method: "get",
  tags: ["User"],
  request: {
    params: UserIdSchema
  },
  responses: createApiResponse(UserResponseSchema, "Get user by id successfully")
});

userRegistry.registerPath({
  path: "/api/v1/user/{id}",
  method: "put",
  tags: ["User"],
  request: {
    params: UserIdSchema,
    body: {
      content: {
        "application/json": {
          schema: UserUpdateRequestSchema,
          example: {
            name: "Thanh Tung",
            email: "thanhtung@gmail.com",
            status: "ACTIVE"
          },
        }
      }
    }
  },
  responses: createApiResponse(UserResponseSchema, "Update user successfully")
});

userRegistry.registerPath({
  path: "/api/v1/user/{id}/avatar",
  method: "put",
  tags: ["User"],
  request: {
    params: UserIdSchema,
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            avatar: z.string().openapi({
              type: "string",
              format: "binary",
            }),
          }),
        }
      }
    }
  },
  responses: createApiResponse(z.null(), "Update avatar user successfully")
});

export function UserRouter(userController: UserController): Router {
  const userRouter = Router();

  userRouter.get('/', PaginationMiddleware, asyncHandler(userController.getUsers));
  userRouter.get('/:id', asyncHandler(userController.getUserById));
  userRouter.post('/', asyncHandler(userController.createUser));
  userRouter.put('/:id', asyncHandler(userController.updateUser));
  userRouter.put('/:id/avatar', upload.single('avatar'), asyncHandler(userController.updateAvatarUser));
 
  return userRouter;
}
