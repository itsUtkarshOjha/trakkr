/*
  Warnings:

  - You are about to drop the column `workoutLogId` on the `WorkoutAnalysis` table. All the data in the column will be lost.
  - Added the required column `workoutId` to the `WorkoutAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkoutAnalysis" DROP CONSTRAINT "WorkoutAnalysis_workoutLogId_fkey";

-- AlterTable
ALTER TABLE "WorkoutAnalysis" DROP COLUMN "workoutLogId",
ADD COLUMN     "workoutId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkoutAnalysis" ADD CONSTRAINT "WorkoutAnalysis_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
