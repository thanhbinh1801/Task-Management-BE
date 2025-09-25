import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import JwtUtils from "@/commons/utils/jwt.util";
import { UnauthorizedException } from "@/commons";

export function guard(schema?: z.ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Check token (Bearer)
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new UnauthorizedException("Missing or invalid token"));
    }

    try {
      const token = authHeader.split(" ")[1];
      const payload = JwtUtils.verifyAccess(token);
      (req as any).user = payload; // gắn payload vào req
    } catch {
      return next(new UnauthorizedException("Invalid or expired token"));
    }

    // 2. Validate body (nếu có schema)
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
