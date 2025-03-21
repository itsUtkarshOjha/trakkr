/*
  Warnings:

  - Added the required column `exerciseId` to the `ExerciseLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `ExerciseLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `WorkoutLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ExerciseLog" DROP CONSTRAINT "ExerciseLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutLog" DROP CONSTRAINT "WorkoutLog_userId_fkey";

-- AlterTable
ALTER TABLE "ExerciseLog" ADD COLUMN     "exerciseId" TEXT NOT NULL,
ADD COLUMN     "oneRepMax" DOUBLE PRECISION,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutLog" ALTER COLUMN "pauseTime" DROP NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseLog" ADD CONSTRAINT "ExerciseLog_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseLog" ADD CONSTRAINT "ExerciseLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
