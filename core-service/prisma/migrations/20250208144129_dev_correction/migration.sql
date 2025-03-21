/*
  Warnings:

  - You are about to drop the column `workoutId` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `name` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "workoutId";

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "name" TEXT NOT NULL;
