/*
  Warnings:

  - You are about to drop the column `analysed` on the `ExerciseLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExerciseLog" DROP COLUMN "analysed";

-- AlterTable
ALTER TABLE "WorkoutLog" ADD COLUMN     "analysed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workoutLogId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_workoutLogId_fkey" FOREIGN KEY ("workoutLogId") REFERENCES "WorkoutLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
