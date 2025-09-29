import { Token } from "@prisma/client";

export interface ITokenRepository {
  saveRefreshToken(data: { userId: string; refreshToken: string; expiresAt: Date }): Promise<Token>;
  findByRefreshToken(refreshToken: string): Promise<Token | null>;
  findByUserId(userId: string): Promise<Token | null>;
  deleteRefreshToken(refreshToken: string): Promise<void>;
}