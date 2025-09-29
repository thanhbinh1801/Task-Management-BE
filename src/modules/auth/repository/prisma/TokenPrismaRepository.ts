import { prisma } from "@/configs/prisma";
import { ITokenRepository } from "../interfaces/ITokenRepository";
import { Token } from "@prisma/client";

export class TokenPrismaRepository implements ITokenRepository {
  async saveRefreshToken({ userId, refreshToken, expiresAt }: { userId: string; refreshToken: string; expiresAt: Date }): Promise<Token> {
    return prisma.token.upsert({
      where: { userId },
      update: { refreshToken, expiresAt },
      create: { userId, refreshToken, expiresAt }
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    return prisma.token.findFirst({
      where: { refreshToken }
    });
  }

  async findByUserId(userId: string): Promise<Token | null> {
    return prisma.token.findUnique({
      where: { userId }
    });
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await prisma.token.deleteMany({
      where: { refreshToken }
    });
  } 
}