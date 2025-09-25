-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "provider" TEXT,
ADD COLUMN     "providerId" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL,
ALTER COLUMN "avatarUrl" DROP NOT NULL;
