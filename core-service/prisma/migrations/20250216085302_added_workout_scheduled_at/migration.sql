/*
  Warnings:

  - Made the column `exerciseLogId` on table `Set` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Days" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_exerciseLogId_fkey";

-- AlterTable
ALTER TABLE "Set" ALTER COLUMN "exerciseLogId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "scheduledAt" "Days"[];

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_exerciseLogId_fkey" FOREIGN KEY ("exerciseLogId") REFERENCES "ExerciseLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
