import { prisma } from "prisma/db";
import { getUser } from "./user.controller";

interface AddExercise {
  name: string;
}

export const addExerciseToOldWorkout = async (
  workoutId: string,
  exerciseName: string,
  userId: string
) => {
  try {
    await prisma.workout.update({
      where: {
        id: workoutId,
        userId,
      },
      data: {
        exercises: {
          connect: {
            name: exerciseName,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(
      "Something went wrong while adding exercise to the workout."
    );
  }
};

export const deleteExerciseFromWorkout = async (
  workoutId: string,
  exerciseId: string,
  userId: string
) => {
  try {
    const targetWorkout = await prisma.workout.findUnique({
      where: {
        id: workoutId,
        userId,
      },
      select: {
        id: true,
        exercises: true,
      },
    });
    if (targetWorkout?.exercises.length === 1) {
      throw new Error("There must be atleast one exercise in the workout.");
    }
    const updatedWorkout = await prisma.workout.update({
      where: {
        id: targetWorkout?.id,
      },
      data: {
        exercises: {
          disconnect: {
            id: exerciseId,
          },
        },
      },
    });
    return updatedWorkout;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Something went wrong while deleting exercise from the workout."
    );
  }
};

export const getTomorrowWorkoutsAndUsers = async () => {
  try {
    console.log("Getting tomorrow's workouts.");
    const today = new Date(Date.now()).getDay();
    const tomorrowWorkouts = await prisma.daysWorkouts.findUnique({
      where: {
        index: (today + 1) % 7,
      },
      select: {
        workouts: {
          select: {
            workoutName: true,
            user: {
              select: {
                firstName: true,
                emailId: true,
              },
            },
          },
        },
      },
    });
    let response: {
      workoutName: string;
      user: { firstName: string; emailId: string };
    }[] = [];
    if (tomorrowWorkouts) {
      response = tomorrowWorkouts.workouts;
    }
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching tomorrow's workouts.");
  }
};

export const getAllExercises = async (workoutId: string) => {
  try {
    const exercises = await prisma.workout.findUnique({
      where: {
        id: workoutId,
      },
      select: {
        exercises: true,
      },
    });
    return exercises?.exercises;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching the exercises.");
  }
};

export const getAllWorkouts = async (userId: string) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        isFinalised: true,
      },
      include: {
        exercises: true,
        WorkoutLog: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return workouts;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get workouts.");
  }
};

export const addWorkout = async (clerkId: string, workoutName: string) => {
  const user = await getUser(clerkId);
  const unfinishedWorkout = await prisma.workout.findFirst({
    where: {
      userId: user?.id,
      isFinalised: false,
    },
  });
  const createdWorkout = await prisma.workout.update({
    where: {
      id: unfinishedWorkout?.id,
    },
    data: {
      isFinalised: true,
      workoutName,
    },
  });
  return createdWorkout;
};

export const addExercise = async (
  clerkId: string,
  exerciseData: AddExercise
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
    //Case 1: Workout creation is already started (exercise is present)
    const unfinishedWorkout = await prisma.workout.findFirst({
      where: {
        isFinalised: false,
        userId: user!.id,
      },
    });
    if (unfinishedWorkout) {
      const updatedWorkout = await prisma.workout.update({
        where: {
          id: unfinishedWorkout.id,
          userId: user!.id,
        },
        data: {
          exercises: {
            connect: {
              name: exerciseData.name,
            },
          },
        },
      });
      const newExercises = await prisma.workout.findUnique({
        where: {
          id: updatedWorkout.id,
        },
        select: {
          exercises: true,
        },
      });
      return newExercises?.exercises;
    }
    //Case 2: Workout creation is yet to be started
    const createdWorkout = await prisma.workout.create({
      data: {
        userId: user!.id,
        workoutName: "Dummy",
        exercises: {
          connect: [
            {
              name: exerciseData.name,
            },
          ],
        },
      },
    });
    const newExercises = await prisma.workout.findUnique({
      where: {
        id: createdWorkout.id,
      },
      select: {
        exercises: true,
      },
    });
    return newExercises;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while adding the exercise!");
  }
};
