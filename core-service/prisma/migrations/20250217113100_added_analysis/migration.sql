-- AlterTable
ALTER TABLE "ExerciseLog" ADD COLUMN     "analysed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "WorkoutAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutLogId" TEXT NOT NULL,
    "totalSets" INTEGER NOT NULL,
    "totalReps" INTEGER NOT NULL,
    "totalVolume" DOUBLE PRECISION NOT NULL,
    "avgWeight" DOUBLE PRECISION NOT NULL,
    "maxWeight" DOUBLE PRECISION NOT NULL,
    "avgRepsPerSet" DOUBLE PRECISION NOT NULL,
    "progression" DOUBLE PRECISION,
    "fatigueIndex" DOUBLE PRECISION,
    "consistencyScore" DOUBLE PRECISION,
    "musclesTargetted" TEXT[],
    "suggestions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutAnalysis" ADD CONSTRAINT "WorkoutAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutAnalysis" ADD CONSTRAINT "WorkoutAnalysis_workoutLogId_fkey" FOREIGN KEY ("workoutLogId") REFERENCES "WorkoutLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
