/*
  Warnings:

  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."UserStatusEnum" AS ENUM ('ACTIVE', 'LOCKED');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "isActive",
ADD COLUMN     "status" "public"."UserStatusEnum" NOT NULL DEFAULT 'ACTIVE';
