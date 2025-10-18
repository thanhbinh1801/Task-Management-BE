import { prisma } from "@/configs/prisma"
import { IOtpRepository } from "../interfaces/IOtpRepository"
import bcrypt from "bcryptjs"

export class OtpPrismaRepository implements IOtpRepository {
  async createOtp(userId: string): Promise<{otp: string, expiryAt: Date}> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const expiryAt = new Date(Date.now() + 10*60*1000); // 10 minutes from now
    await prisma.otp.create({
      data: {
        userId,
        otp: hashedOtp,
        expiresAt: expiryAt
      }
    });
    return { otp, expiryAt };
  }

  async verifyOtp(userId: string, otp: string): Promise<boolean> {
    const otpInstance = await prisma.otp.findFirst({
      where: {
        userId,
        expiresAt: {
          gte: new Date()
        }
      }
    });
    if (!otpInstance) return false;
    return bcrypt.compare(otp, otpInstance.otp);
  }

  async deleteOtp(userId: string): Promise<void> {
    await prisma.otp.deleteMany({ where: { userId } });
  }
}