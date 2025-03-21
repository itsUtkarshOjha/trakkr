import { prisma } from "prisma/db";
import { ExerciseWithOneRepMax } from "~/lib/interfaces";

export const getNumberOfSets = async (userId: string) => {
  try {
    const exercisesWithSets = await prisma.exerciseLog.findMany({
      where: {
        userId,
      },
      select: {
        sets: {
          select: {
            id: true,
          },
        },
      },
    });
    let numberOfSets = 0;
    for (const set of exercisesWithSets) {
      numberOfSets += set.sets.length;
    }
    return numberOfSets;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while counting the sets.");
  }
};

export const getMaxOneRepMax = async (userId: string) => {
  try {
    const maxOneRepMax = await prisma.exerciseLog.findMany({
      where: {
        userId,
        oneRepMax: {
          not: null,
        },
      },
      select: {
        exercise: {
          select: {
            name: true,
          },
        },
        oneRepMax: true,
      },
      orderBy: {
        oneRepMax: "desc",
      },
      take: 1,
    });
    if (maxOneRepMax.length === 0) return { maxOneRepMax: 0, exerciseName: "" };
    const requiredLog = maxOneRepMax[0];
    if (requiredLog.oneRepMax === null)
      return { maxOneRepMax: 0, exerciseName: "" };
    return {
      maxOneRepMax: requiredLog.oneRepMax,
      exerciseName: requiredLog.exercise.name,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching maximum one rep max.");
  }
};

export const getExercisesWithOneRepMaxes = async (userId: string) => {
  try {
    const requiredExercises = await prisma.exercise.findMany({
      where: {
        ExerciseLog: {
          some: {
            oneRepMax: {
              not: null,
            },
          },
        },
      },
      include: {
        ExerciseLog: {
          where: {
            userId,
            oneRepMax: {
              not: null,
            },
          },
          select: {
            createdAt: true,
            oneRepMax: true,
          },
        },
      },
    });
    const exercisesWithOneRepMaxes = requiredExercises.map((exercise) => {
      const exerciseWithOneRepMax: ExerciseWithOneRepMax = {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        oneRepMaxes: exercise.ExerciseLog.map((log) => {
          const oneRepMax = {
            oneRepMax: log.oneRepMax!,
            recordedAt: log.createdAt,
          };
          return oneRepMax;
        }),
      };
      return exerciseWithOneRepMax;
    });
    return exercisesWithOneRepMaxes;
  } catch (error) {
    throw new Error(
      "Something went wrong while fetching exercises with one rep maxes."
    );
  }
};
