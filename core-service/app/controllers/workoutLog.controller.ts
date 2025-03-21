import { Days, Set } from "@prisma/client";
import { prisma } from "prisma/db";
import { dayToIndex } from "~/lib/constants";
import { CurrentExercise, CurrentWorkout } from "~/lib/interfaces";
import redisInit from "redis/redisClient";
import schedule from "node-schedule";
import { v4 as uuidv4 } from "uuid";

export const getLatestWorkoutLogId = async (
  userId: string,
  workoutId: string
) => {
  try {
    const latestWorkoutLog = await prisma.workoutLog.findMany({
      where: {
        userId,
        workoutId,
      },
      select: {
        id: true,
        analysed: true,
      },
      take: 1,
      orderBy: {
        createdAt: "desc",
      },
    });
    return latestWorkoutLog[0];
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching latest workout log.");
  }
};

export const getWorkoutLogsById = async (logId: string) => {
  try {
    const workoutLog = await prisma.workoutLog.findUnique({
      where: {
        id: logId,
      },
      select: {
        id: true,
        ExerciseLog: {
          select: {
            id: true,
            exercise: {
              select: {
                name: true,
                tags: true,
              },
            },
            sets: true,
            oneRepMax: true,
          },
        },
        workout: {
          select: {
            workoutName: true,
          },
        },
        createdAt: true,
      },
    });
    return workoutLog;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching workout log.");
  }
};

export const deleteSet = async (userId: string, setId: string) => {
  try {
    const redisClient = await redisInit();
    const currentWorkout: CurrentWorkout = await getCurrentWorkoutLog(userId);
    const exercises = currentWorkout.exercise;
    for (const exercise of exercises) {
      const { details } = exercise;
      const newDetails = details.filter((detail) => {
        return detail.detailId !== setId;
      });
      exercise.details = newDetails;
      if (newDetails.length === 0) {
        const targetIndex = exercises.indexOf(exercise);
        exercises.splice(targetIndex, 1);
      }
    }
    if (exercises.length === 0) {
      currentWorkout.workoutLogId = undefined;
    }
    currentWorkout.exercise = exercises;
    await redisClient.set(
      `ongoingWorkout-${userId}`,
      JSON.stringify(currentWorkout)
    );
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while deleting the set!");
  }
};

export const deleteWorkoutLog = async (userId: string) => {
  try {
    const redisClient = await redisInit();
    const currentWorkout: CurrentWorkout = await getCurrentWorkoutLog(userId);
    if (!currentWorkout) return;
    if (currentWorkout.exercise.length > 0)
      await prisma.exerciseLog.deleteMany({
        where: {
          workoutLogId: currentWorkout.workoutLogId,
        },
      });
    if (currentWorkout.workoutLogId) {
      await prisma.workoutLog.delete({
        where: {
          id: currentWorkout.workoutLogId,
        },
      });
    }
    await redisClient.del(`ongoingWorkout-${userId}`);
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while discarding the workout.");
  }
};

export const getUpcomingWorkouts = async (userId: string) => {
  try {
    const allWorkouts = await prisma.workout.findMany({
      where: {
        userId,
      },
      select: {
        workoutName: true,
        scheduledAt: true,
      },
    });
    if (allWorkouts.length === 0) return [];

    const dayToWorkoutMapping: {
      workoutName: string;
      scheduledAt: Days[];
    }[][] = [[], [], [], [], [], [], []];

    let dayAlloted = false;

    allWorkouts.forEach((workout) => {
      workout.scheduledAt.map((day) => {
        dayAlloted = true;
        const dayIndex = dayToIndex[day];
        dayToWorkoutMapping[dayIndex].push(workout);
      });
    });
    if (!dayAlloted) return [];
    const todayIndex = new Date(Date.now()).getDay();
    let iterator = todayIndex;
    let multiplier = 0;
    const upcomingWorkouts: {
      workoutName: string;
      daysFromNow: number;
    }[] = [];
    while (upcomingWorkouts.length < 5) {
      dayToWorkoutMapping[iterator].forEach((workout) => {
        const detail = {
          workoutName: workout.workoutName,
          daysFromNow: iterator - todayIndex + multiplier * 7,
        };
        upcomingWorkouts.push(detail);
      });
      iterator++;
      if (iterator > 6) {
        iterator = iterator % 7;
        multiplier++;
      }
    }
    return upcomingWorkouts;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching upcoming workouts.");
  }
};

export const setScheduledAt = async (
  userId: string,
  workoutId: string,
  days: Days[]
) => {
  try {
    const scheduledAt = days.filter((day: string) => day !== "");
    const updatedWorkout = await prisma.workout.update({
      where: {
        id: workoutId,
        userId,
      },
      data: {
        scheduledAt,
      },
    });
    for (const day of days) {
      const existingDay = await prisma.daysWorkouts.findUnique({
        where: {
          name: day,
        },
      });

      if (!existingDay) {
        await prisma.daysWorkouts.create({
          data: {
            index: dayToIndex[day],
            name: day,
            workouts: {
              connect: {
                id: workoutId,
              },
            },
          },
        });
      } else {
        await prisma.daysWorkouts.update({
          where: {
            id: existingDay.id,
          },
          data: {
            workouts: {
              connect: {
                id: workoutId,
              },
            },
          },
        });
      }
    }
    return updatedWorkout;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while scheduling the workout.");
  }
};

export const getWorkoutLogs = async (
  userId: string,
  skip?: number,
  take?: number
) => {
  try {
    if (!take) take = 10;
    const logCount = await prisma.workoutLog.count({
      where: {
        userId,
        inProgress: false,
      },
    });
    const workoutLogs = await prisma.workoutLog.findMany({
      where: {
        userId,
        inProgress: false,
      },
      select: {
        workout: {
          select: {
            workoutName: true,
            id: true,
          },
        },
        id: true,
        createdAt: true,
      },
      take,
      skip: skip || 0,
      orderBy: {
        createdAt: "desc",
      },
    });
    return { workoutLogs, logCount };
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching past workouts.");
  }
};

export const startWorkoutLog = async (workoutId: string, userId: string) => {
  try {
    const redisClient = await redisInit();
    const workoutDetails: CurrentWorkout = {
      workoutId,
      startTime: Date.now(),
      exercise: [],
    };
    await redisClient.set(
      `ongoingWorkout-${userId}`,
      JSON.stringify(workoutDetails)
    );
    const endTime = new Date(Date.now() + 4 * 60 * 60 * 1000);
    // const endTime = new Date(Date.now() + 5 * 1000);
    schedule.scheduleJob(endTime, async () => {
      await deleteWorkoutLog(userId);
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while starting the workout.");
  }
};

export const getCurrentWorkoutLog = async (userId: string) => {
  try {
    const redisClient = await redisInit();
    const currentWorkout = await redisClient.get(`ongoingWorkout-${userId}`);
    if (currentWorkout) return JSON.parse(currentWorkout);
    return false;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching current workout.");
  }
};

export const addSetsAndReps = async (
  userId: string,
  exerciseId: string,
  reps: number,
  weight: number
) => {
  try {
    const redisClient = await redisInit();
    let currentWorkout: CurrentWorkout = await getCurrentWorkoutLog(userId);
    let workoutLog = await prisma.workoutLog.findFirst({
      where: {
        userId,
        workoutId: currentWorkout.workoutId,
        inProgress: true,
      },
    });
    if (!workoutLog) {
      workoutLog = await prisma.workoutLog.create({
        data: {
          workoutId: currentWorkout.workoutId,
          userId,
        },
      });
    }
    const updatedCurrentWorkout = {
      ...currentWorkout,
      workoutLogId: workoutLog.id,
    };
    await redisClient.set(
      `ongoingWorkout-${userId}`,
      JSON.stringify(updatedCurrentWorkout)
    );
    currentWorkout = await getCurrentWorkoutLog(userId);
    let exerciseLog = await prisma.exerciseLog.findFirst({
      where: {
        exerciseId,
        workoutLogId: workoutLog.id,
        userId,
      },
    });
    if (!exerciseLog) {
      exerciseLog = await prisma.exerciseLog.create({
        data: {
          exerciseId,
          workoutLogId: workoutLog.id,
          userId,
        },
      });
    }
    if (currentWorkout.exercise.length === 0) {
      const detailId = uuidv4();
      const currentExercise: CurrentExercise = {
        exerciseId,
        exerciseLogId: exerciseLog.id,
        details: [
          {
            detailId,
            reps,
            weight,
          },
        ],
        oneRepMax: Math.ceil(weight / (1.03 - 0.03 * reps)),
      };
      const updatedCurrentWorkout: CurrentWorkout = {
        ...currentWorkout,
        exercise: [currentExercise],
      };
      await redisClient.set(
        `ongoingWorkout-${userId}`,
        JSON.stringify(updatedCurrentWorkout)
      );
      return { updatedCurrentWorkout, exerciseLog };
    }
    const targetExercise: CurrentExercise[] = [];
    currentWorkout.exercise.forEach((exercise) => {
      if (exercise.exerciseId === exerciseId) targetExercise.push(exercise);
    });
    let targetIndex = currentWorkout.exercise.indexOf(targetExercise[0]);
    if (targetExercise.length === 0) {
      targetExercise.push({
        exerciseId,
        exerciseLogId: exerciseLog.id,
        details: [{ detailId: uuidv4(), reps, weight }],
        oneRepMax: Math.ceil(weight / (1.03 - 0.03 * reps)),
      });
      targetIndex = currentWorkout.exercise.length;
    } else {
      targetExercise[0].details.push({ detailId: uuidv4(), reps, weight });
      const oldOneRepMax = targetExercise[0].oneRepMax;
      const newOneRepMax = weight / (1.03 - 0.03 * reps);
      if (oldOneRepMax && newOneRepMax > oldOneRepMax)
        targetExercise[0].oneRepMax = newOneRepMax;
    }
    currentWorkout.exercise[targetIndex] = targetExercise[0];
    await redisClient.set(
      `ongoingWorkout-${userId}`,
      JSON.stringify(currentWorkout)
    );
    return { currentWorkout, exerciseLog };
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while adding reps and weights.");
  }
};

export const pauseWorkoutLog = async (userId: string) => {
  try {
    const redisClient = await redisInit();
    const currentWorkout = await getCurrentWorkoutLog(userId);
    const updatedCurrentWorkout = { ...currentWorkout, pausedAt: Date.now() };
    const updatedWorkout = await redisClient.set(
      `ongoingWorkout-${userId}`,
      JSON.stringify(updatedCurrentWorkout)
    );
    return updatedWorkout;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while pausing the workout.");
  }
};

export const resumeWorkoutLog = async (userId: string) => {
  try {
    const redisClient = await redisInit();
    const currentWorkout = await getCurrentWorkoutLog(userId);
    const currentTime = Date.now();
    let pauseTime = currentTime - currentWorkout.pausedAt;
    if (currentWorkout.pauseTime) {
      pauseTime += currentWorkout.pauseTime;
    }
    const updatedCurrentWorkout = {
      ...currentWorkout,
      pausedAt: null,
      pauseTime,
    };
    const updatedWorkout = await redisClient.set(
      `ongoingWorkout-${userId}`,
      JSON.stringify(updatedCurrentWorkout)
    );
    return updatedWorkout;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while resuming the workout.");
  }
};

export const finishWorkout = async (userId: string) => {
  try {
    const redisClient = await redisInit();
    let currentWorkout: CurrentWorkout = await getCurrentWorkoutLog(userId);
    if (currentWorkout.pausedAt && !currentWorkout.pauseTime) {
      currentWorkout.pauseTime = Date.now() - currentWorkout.pausedAt;
    }
    const updatedCurrentWorkout = { ...currentWorkout, endTime: Date.now() };
    await redisClient.set(
      `ongoingWorkout-${userId}`,
      JSON.stringify(updatedCurrentWorkout)
    );
    currentWorkout = updatedCurrentWorkout;
    const doneExercises = currentWorkout.exercise;
    doneExercises.forEach(async (exercise) => {
      const sets: Set[] = [];
      exercise.details.forEach(async (detail) => {
        const setCreated = await prisma.set.create({
          data: {
            exerciseId: exercise.exerciseId,
            weightLifted: detail.weight,
            reps: detail.reps,
            exerciseLogId: exercise.exerciseLogId,
          },
        });
        sets.push(setCreated);
      });
      const duration = exercise.duration;
      await prisma.exerciseLog.update({
        where: {
          id: exercise.exerciseLogId,
        },
        data: {
          userId,
          sets: {
            create: sets,
          },
          oneRepMax: exercise.oneRepMax,
          exerciseId: exercise.exerciseId,
          duration,
        },
      });
    });
    const workoutLog = await prisma.workoutLog.update({
      where: {
        id: currentWorkout.workoutLogId,
      },
      data: {
        workoutId: currentWorkout.workoutId,
        inProgress: false,
        startTime: new Date(currentWorkout.startTime),
        endTime: new Date(currentWorkout.endTime!),
        userId,
        pauseTime: currentWorkout.pauseTime
          ? currentWorkout.pauseTime / 1000
          : null, //sending pause time in seconds
      },
    });
    await redisClient.del(`ongoingWorkout-${userId}`);
    // await analysisAgent.invoke({
    //   workoutLogId: workoutLog.id,
    //   workoutId: currentWorkout.workoutId,
    //   userId,
    // });
    return workoutLog;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while finishing the workout.");
  }
};
