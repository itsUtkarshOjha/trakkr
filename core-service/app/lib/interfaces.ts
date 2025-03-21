import { Days, Exercise } from "@prisma/client";

export interface UploadImage {
  function: "imageUpload";
  filePath: string;
}
export interface SendNotification {
  function: "sendNotification";
  filePath: string;
}

export interface CurrentExercise {
  exerciseId: string;
  exerciseLogId: string;
  details: {
    detailId: string;
    reps: number;
    weight: number;
  }[];
  duration?: number;
  oneRepMax?: number;
}

export interface CurrentWorkout {
  workoutId: string;
  workoutLogId?: string;
  startTime: number;
  pausedAt?: number;
  pauseTime?: number;
  exercise: CurrentExercise[];
  endTime?: number;
}

export interface WorkoutLogForAnalysis {
  id: string;
  createdAt: Date;
  workout: {
    workoutName: string;
  };
  ExerciseLog: {
    id: string;
    oneRepMax: number | null;
    sets: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      exerciseId: string;
      weightLifted: number;
      reps: number;
      exerciseLogId: string;
    }[];
    exercise: {
      name: string;
      tags: string[];
    };
  }[];
}

export interface ExerciseWithOneRepMax {
  exerciseId: string;
  exerciseName: string;
  oneRepMaxes: {
    oneRepMax: number;
    recordedAt: Date;
  }[];
}

export interface ChartData {
  value: number;
  recordedAt: string;
}

export interface WorkoutLogShort {
  id: string;
  createdAt: Date;
  workout: {
    id: string;
    workoutName: string;
  };
}

export interface WorkoutsWithExercises {
  userId: string;
  id: string;
  workoutName: string;
  scheduledAt: Days[];
  createdAt: Date;
  updatedAt: Date;
  exercises: Exercise[];
}

export interface AnalysedData {
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  avgWeight: number;
  maxWeight: number;
  avgRepsPerSet: number;
  progression: number;
  fatigueIndex: number;
  consistencyScore: number;
  musclesTargetted: string[];
  suggestions: string[];
}

export interface NotificationBody {
  html: string;
  emailId: string;
}
