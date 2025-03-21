/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `DaysWorkouts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `DaysWorkouts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DaysWorkouts_index_key" ON "DaysWorkouts"("index");

-- CreateIndex
CREATE UNIQUE INDEX "DaysWorkouts_name_key" ON "DaysWorkouts"("name");
