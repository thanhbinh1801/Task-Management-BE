import { Otp } from "@prisma/client";

export interface IOtpRepository {
  createOtp(data: any): Promise<{otp: string, expiryAt: Date}>;
  verifyOtp(userId: string, otp: string): Promise<boolean>;
  deleteOtp(userId: string): Promise<void>;
}