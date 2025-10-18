import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import JwtUtils from "@/commons/utils/jwt.util";
import { UnauthorizedException } from "@/commons";

export const authenticate = (schema?: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid token");
    }

    try {
      const token = authHeader.split(" ")[1];
      const payload = JwtUtils.verifyAccess(token);
      req.users = {
        userId: payload.userId,
        email: payload.email
      }; 
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
    
    if (schema) {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Validation error",
          errors: result.error.flatten(),
        });
      }
      req.body = result.data;
    }

    next();
  };
}
