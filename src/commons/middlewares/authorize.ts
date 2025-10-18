import { prisma } from "@/configs";
import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../exceptions";

type Scope = "workspace" | "board" | "global";

export const authorize = (requiredPermissions: string[], scope: Scope) => {
  return async ( req: Request, res: Response, next: NextFunction) => {
    try {
      if(!req.users?.userId){
        return res.status(401).json({message: "Unauthorized error"});
      }
      if (scope === "global") {
        // TODO: nếu bạn có RBAC global thì kiểm tra ở đây; 
        return next();
      }

      const workspaceId = req.params.id;
      console.log("workspaceId: ", workspaceId)

      if(!workspaceId) {
        throw new BadRequestException("khong co id trong param")
      }

      let membership;
      if( scope == "workspace"){
        membership = await prisma.workspaceMember.findUnique({
          where: { userId_workspaceId: {userId: req.users.userId, workspaceId: req.params.id}},
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
          where: { userId_boardId: { userId: req.users.userId, boardId: req.params.id}},
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
        return res.status(403).json({message: "Forbidden: not a board member"});
      }

      const permissionSet = new Set(
        membership.role.RolePermission.map(rp => rp.permission.permissionName)
      );

      console.log('[authorize] required:', requiredPermissions);
      console.log('[authorize] userPerms:', Array.from(permissionSet));


      const isPermitted = requiredPermissions.every( p => permissionSet.has(p)); 
      if( !isPermitted) return res.status(403).json({ message: "Forbidden: missing permission" });


      return next();
    } catch(err) {
      console.error("[authorize] error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}