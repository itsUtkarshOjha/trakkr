/*
  Warnings:

  - Made the column `targetWeight` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "targetWeight" SET NOT NULL,
ALTER COLUMN "targetWeight" SET DEFAULT -1;
