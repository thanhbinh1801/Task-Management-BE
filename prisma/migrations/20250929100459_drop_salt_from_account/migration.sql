/*
  Warnings:

  - You are about to drop the column `salt` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Account" DROP COLUMN "salt";
