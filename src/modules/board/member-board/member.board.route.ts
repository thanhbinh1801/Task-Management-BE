import { Router } from "express";
import { asyncHandler, authenticate, authorize } from "@/commons";
import MemberBoardController from "./member.board.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/swagger";
import z from "zod";

export const memberBoardRegistry = new OpenAPIRegistry();

memberBoardRegistry.registerPath({
  path: '/api/v1/board/{boardId}/members',
  method: "post",
  tags: ["Member Board"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      boardId: z.string() 
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email(),
            boardId: z.string(),
          })
        }
      }
    }
  },
  responses: createApiResponse(z.null() , "Success"),
});

memberBoardRegistry.registerPath({
  path: '/api/v1/board/{boardId}/members',
  method: "get",
  tags: ["Member Board"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      boardId: z.string()
    })
  },
  responses: createApiResponse(z.null(), "Success"),
});

memberBoardRegistry.registerPath({
  path: '/api/v1/board/{boardId}/members',
  method: "put",
  tags: ["Member Board"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      boardId: z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            boardId: z.string(),
            userId: z.string(),
            role: z.enum(['OwnerBoard', 'MemberBoard'])
          })
        }
      }
    }
  },
  responses: createApiResponse(z.null(), "Success"),
});

memberBoardRegistry.registerPath({
  path: '/api/v1/board/{boardId}/members',
  method: "delete",
  tags: ["Member Board"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      boardId: z.string()
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            userId: z.string(),
            boardId: z.string()
          })
        }
      }
    }
  },
  responses: createApiResponse(z.null(), "Success"),
});

export function MemberBoardRouter (memberController: MemberBoardController) : Router  { 
  const memberBoardRouter = Router();
  
  memberBoardRouter.post('/:boardId/members', asyncHandler(authenticate()), asyncHandler(authorize(['ADD_MEMBER'], "board")), 
                        asyncHandler(memberController.addMemberBoardByEmail));   
  memberBoardRouter.get('/:boardId/members', asyncHandler(authenticate()), asyncHandler(authorize(['VIEW_MEMBER'], "board")), 
                        asyncHandler(memberController.viewMemberBoard));  
  memberBoardRouter.put('/:boardId/members', asyncHandler(authenticate()), asyncHandler(authorize(['CHANGE_MEMBER_PERMISSION'], "board")), 
                        asyncHandler(memberController.changePermissionMemberBoard));  
  memberBoardRouter.delete('/:boardId/members', asyncHandler(authenticate()), asyncHandler(authorize(['REMOVE_MEMBER'], "board")), 
                        asyncHandler(memberController.removeMemberBoard));
  return memberBoardRouter;  
}