/*
  Warnings:

  - Added the required column `position` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."BoardJoinLink" ALTER COLUMN "isRevoke" SET DEFAULT false;

-- AlterTable
ALTER TABLE "public"."List" ADD COLUMN     "position" DECIMAL(20,10) NOT NULL;

-- AlterTable
ALTER TABLE "public"."WorkspaceJoinLink" ALTER COLUMN "isRevoke" SET DEFAULT false;
