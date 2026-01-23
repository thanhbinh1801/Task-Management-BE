/*
  Warnings:

  - You are about to alter the column `position` on the `ChecklistItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,10)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "ChecklistItem" ALTER COLUMN "position" SET DATA TYPE INTEGER;
