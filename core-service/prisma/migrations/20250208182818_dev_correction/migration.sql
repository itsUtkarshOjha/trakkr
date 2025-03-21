/*
  Warnings:

  - You are about to drop the column `muscleGroup` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the `ExerciseOnWorkout` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExerciseOnWorkout" DROP CONSTRAINT "ExerciseOnWorkout_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "ExerciseOnWorkout" DROP CONSTRAINT "ExerciseOnWorkout_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExerciseOnWorkout" DROP CONSTRAINT "ExerciseOnWorkout_workoutId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "muscleGroup";

-- DropTable
DROP TABLE "ExerciseOnWorkout";
