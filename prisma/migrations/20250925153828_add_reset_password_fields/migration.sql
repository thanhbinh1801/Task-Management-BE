-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "resetPasswordOtp" TEXT,
ADD COLUMN     "resetPasswordOtpExpiry" TIMESTAMP(3);
