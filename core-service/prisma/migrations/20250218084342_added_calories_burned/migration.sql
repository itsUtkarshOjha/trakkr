/*
  Warnings:

  - You are about to drop the column `consistencyScore` on the `WorkoutAnalysis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkoutAnalysis" DROP COLUMN "consistencyScore",
ADD COLUMN     "estimatedCaloriesBurned" INTEGER;

-- AlterTable
ALTER TABLE "WorkoutLog" ALTER COLUMN "inProgress" SET DEFAULT true;
