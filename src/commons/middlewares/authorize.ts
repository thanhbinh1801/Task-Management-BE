import { prisma } from "@/configs";
import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../exceptions";
import { redis } from "@/configs/redis.config";

type Scope = "workspace" | "board" | "global";

export const authorize = (requiredPermissions: string[], scope: Scope) => {
  return async ( req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.users?.userId;
      if(!userId){
        return res.status(401).json({message: "Unauthorized error"});
      }
      if (scope === "global") {
        // TODO: nếu có RBAC global thì kiểm tra ở đây; 
        return next();
      }

      const workspaceId = req.params.workspaceId;
      console.log("workspaceId: ", workspaceId)

      const boardId = req.params.boardId;
      console.log("boardId: ", boardId);

      if (!workspaceId && scope === "workspace") {
        throw new BadRequestException("Missing workspaceId in params");
      }

      if (!boardId && scope === "board") {
        throw new BadRequestException("Missing boardId in params");
      }

      // create cache key
      const cacheKey = scope === "workspace" ? 'workspace_permissions_' + workspaceId + '_' + userId 
                                            : 'board_permissions_' + boardId + '_' + userId; 

      // check cache
      const cachePermissions = await redis.get(cacheKey);

      if(cachePermissions){
        const data = JSON.parse(cachePermissions) as string[];
        const permissionSet = new Set(data);

        console.log('[authorize - cache] required:', requiredPermissions);
        console.log('[authorize - cache] userPerms:', Array.from(permissionSet));

        const isPermitted = requiredPermissions.every( p => permissionSet.has(p));
        if( !isPermitted) return res.status(403).json({ message: "Forbidden: missing permission" });

        return next();
      }
      
      // cache miss -> fetch data from DB

      let membership;
      if( scope == "workspace"){
        membership = await prisma.workspaceMember.findUnique({
          where: { userId_workspaceId: {userId: userId, workspaceId: workspaceId}},
          select: {
            role: {
              select: {
                RolePermission: {
                  select: { permission: { select: { permissionName: true}}}
                }
              }
            }
          }
        });
      } else {
        membership = await  prisma.boardMember.findUnique({
          where: { userId_boardId: { userId: userId, boardId: boardId}},
          select: {
            role: {
              select: {
                RolePermission: {
                  select: { permission: { select: { permissionName: true}}}
                }
              }
            }
          }
        });
      }

      if(!membership){
        return res.status(403).json({message: "Forbidden: not a member"});
      }

      const permissionSet = new Set(
        membership.role.RolePermission.map(rp => rp.permission.permissionName)
      );

      console.log('[authorize] required:', requiredPermissions);
      console.log('[authorize] userPerms:', Array.from(permissionSet));

      // cache the permissions
      const ttl = 300; // cache for 5 minutes
      await redis.set( cacheKey, JSON.stringify(Array.from(permissionSet)), 'EX', ttl);

      const isPermitted = requiredPermissions.every( p => permissionSet.has(p)); 
      if( !isPermitted) return res.status(403).json({ message: "Forbidden: missing permission" });


      return next();
    } catch(err) {
      console.error("[authorize] error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}