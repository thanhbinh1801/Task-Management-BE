import { prisma } from "@/configs/prisma"
import { IOtpRepository } from "../interfaces/IOtpRepository"
import bcrypt from "bcryptjs"
import { redisService } from '@/modules/redis/redis.service'

export class OtpPrismaRepository implements IOtpRepository {
  async createOtp(userId: string): Promise<{ otp: string, expiryAt: Date }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const expiryAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await prisma.otp.create({
      data: {
        userId,
        otp: hashedOtp,
        expiresAt: expiryAt
      }
    });
    // cái này là lưu trữ OTP đã hash vào Redis 
    try {
      await redisService.set(`otp:${userId}`, { otp: hashedOtp }, 10 * 60);
    } catch (err) {
      console.error('Redis set otp error', err);
    }
    return { otp, expiryAt };
  }

  async verifyOtp(userId: string, otp: string): Promise<boolean> {
    // Try Redis first
    try {
      const cached = await redisService.get<{ otp: string }>(`otp:${userId}`);
      if (cached && cached.otp) {
        const match = await bcrypt.compare(otp, cached.otp);
        if (match) {
          // consume otp
          await this.deleteOtp(userId);
        }
        return match;
      }
    } catch (err) {
      console.error('Redis get otp error', err);
      // continue to DB fallback
    }

    const otpInstance = await prisma.otp.findFirst({
      where: {
        userId,
        expiresAt: {
          gte: new Date()
        }
      }
    });
    if (!otpInstance) return false;
    const match = await bcrypt.compare(otp, otpInstance.otp);
    if (match) {
      await this.deleteOtp(userId);
    }
    return match;
  }

  async deleteOtp(userId: string): Promise<void> {
    try {
      await redisService.del(`otp:${userId}`);
    } catch (err) {
      console.error('Redis delete otp error', err);
    }
    await prisma.otp.deleteMany({ where: { userId } });
  }
}