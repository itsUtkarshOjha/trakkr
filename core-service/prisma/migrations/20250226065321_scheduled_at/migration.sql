-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "daysWorkoutsId" TEXT;

-- CreateTable
CREATE TABLE "DaysWorkouts" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DaysWorkouts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_daysWorkoutsId_fkey" FOREIGN KEY ("daysWorkoutsId") REFERENCES "DaysWorkouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
