import "dotenv/config";
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";


export default class JwtUtils {
  static signAccess(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "15m" });
  }

  static signRefresh(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "7d" });
  }

  static verifyAccess(token: string): JwtPayload | string {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }
}
