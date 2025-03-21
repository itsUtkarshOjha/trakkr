import { prisma } from "prisma/db";
import { getUser } from "./user.controller";

export const getAllExercises = async (query: string) => {
  try {
    const exercises =
      await prisma.$queryRaw`SELECT *, similarity("name", ${query}) as similarity_score FROM "Exercise" WHERE similarity("name", ${query}) > 0.2 ORDER BY similarity_score DESC
LIMIT 10;`;
    return exercises;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while getting the exercises!");
  }
};

export const getExercises = async (clerkId: string) => {
  try {
    const user = await getUser(clerkId);
    const workoutCount = await prisma.workout.count({
      where: {
        userId: user?.id,
      },
    });
    if (workoutCount === 0) {
      return [];
    }
    const exercisesAdded = await prisma.workout.findFirst({
      where: {
        userId: user?.id,
        isFinalised: false,
      },
      select: {
        exercises: true,
      },
    });
    return exercisesAdded?.exercises;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get logged exercises.");
  }
};

export const editExercise = async (exerciseId: string, newName: string) => {
  try {
    const updatedExercise = await prisma.exercise.update({
      where: {
        id: exerciseId,
      },
      data: {
        name: newName,
      },
    });
    return updatedExercise;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while editing the exercise.");
  }
};

export const deleteExercise = async (exerciseId: string, clerkId: string) => {
  try {
    const user = await getUser(clerkId);
    const unfinishedWorkout = await prisma.workout.findFirst({
      where: {
        userId: user?.id,
        isFinalised: false,
      },
    });
    await prisma.workout.update({
      where: {
        id: unfinishedWorkout?.id,
      },
      data: {
        exercises: {
          disconnect: {
            id: exerciseId,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while deleting the exercise.");
  }
};
