/*
  Warnings:

  - You are about to drop the column `muscleGroup` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Workout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "muscleGroup",
DROP COLUMN "type";

-- DropEnum
DROP TYPE "MuscleGroups";

-- DropEnum
DROP TYPE "TypeOfWorkout";
