import "dotenv/config";
import jwt from "jsonwebtoken";
import { AppJwtPayload } from "@/commons/dtos/jwtPayload.schema";
import { appEnv } from "@/configs";


export default class JwtUtils {
  static signAccess(payload: AppJwtPayload): string {
    return jwt.sign(payload, appEnv.JWT_SECRET, { expiresIn: "15m" });
  }

  static signRefresh(payload: AppJwtPayload): string {
    return jwt.sign(payload, appEnv.JWT_SECRET, { expiresIn: "7d" });
  }

  static verifyAccess<T= AppJwtPayload>(token: string){
    return jwt.verify(token, appEnv.JWT_SECRET) as T;
  }

  static verifyRefresh<T = AppJwtPayload>(token: string) {
    return jwt.verify(token, appEnv.JWT_SECRET) as T;
  }
}
