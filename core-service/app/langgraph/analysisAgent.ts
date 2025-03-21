import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { llm } from "./llm";
import { string, z } from "zod";
import { prisma } from "prisma/db";
import { AnalysedData } from "~/lib/interfaces";

const StateAnnotation = Annotation.Root({
  userId: Annotation<string>,
  workoutId: Annotation<string>,
  rawData: Annotation<string>,
  analysedData: Annotation<string>,
});

const ResponseFormatter = z.object({
  totalSets: z.number().describe("The total number of sets the user has done."),
  totalReps: z.number().describe("The total number of reps the user has done."),
  totalVolume: z
    .number()
    .describe(
      "The total workout volume calculated from sets, reps and weights."
    ),
  avgWeight: z.number().describe("The average weight lifted in this workout."),
  maxWeight: z.number().describe("The maximum weight lifted in this workout."),
  avgRepsPerSet: z
    .number()
    .describe("The average number of reps per set in this workout."),
  progression: z
    .number()
    .describe(
      "An index decimal number to showcase whether the user has progressed in his strength or not based on the previous analyses, where 1 represents no change, less than 1 means decrease in strength and more than 1 means increase in strength. If no previous analysis is given, return 1."
    ),
  fatigueIndex: z
    .number()
    .describe(
      "You are an expert in exercise science and sports performance. Your task is to calculate the Fatigue Index (FI) for a workout session. Very keenly notice the variation of number of reps and weights in an exercise, if the number of reps are falling short, the person is getting more fatigued. If he is performing more compound movements, he is getting more fatigued. If he is performing a workout too quickly after his previous workout, he is getting more fatigued. Judge on these parameters and give a fatigue index of 0 and 1. Take workout volume into account as well."
    ),
  estimatedCaloriesBurned: z
    .number()
    .describe(
      "Estimated calories burned in this workout. Calculate the number of calories by formula-> 0.0175 * 5.5 * duration of workout in minutes"
    ),
  musclesTargetted: z
    .array(string())
    .describe("An array depicting the muscles targetted during the workout."),
  suggestions: z
    .array(string())
    .describe(
      "An array of strings describing the workout in bullet points, try to include an amazing fact about the workout which pleases the user, try to be unique everytime, mainly discussing about further strategies or telling if the muscle groups were properly hit or if the user has hit a plateau. Don't give vague advices, back every statement with data, consider telling percentage improvements or degradations. Also give an estimated time of recovery of the muscles based on the workout volume and progression, also make sure to tell the user whether he/she is performing a particular exercise too frequently or giving too much gaps. Keep it to maximum 2 bullet points with maximum 40 words each, so you know that you have to say only the important data based things."
    ),
});

const retrieveWorkoutAnalyses = async (state: typeof StateAnnotation.State) => {
  try {
    const pastWorkoutLogs = await prisma.workoutLog.findMany({
      where: {
        userId: state.userId,
        workoutId: state.workoutId,
        analysed: true,
      },
      select: {
        ExerciseLog: {
          select: {
            duration: true,
            oneRepMax: true,
            exercise: {
              select: {
                id: true,
                name: true,
              },
            },
            sets: {
              select: {
                reps: true,
                weightLifted: true,
                exerciseId: true,
              },
            },
          },
        },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });
    const workoutLog = await prisma.workoutLog.findMany({
      where: {
        userId: state.userId,
        workoutId: state.workoutId,
        analysed: false,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        pauseTime: true,
        ExerciseLog: {
          select: {
            duration: true,
            oneRepMax: true,
            exercise: {
              select: {
                id: true,
                name: true,
              },
            },
            sets: {
              select: {
                reps: true,
                weightLifted: true,
                exerciseId: true,
              },
            },
          },
        },
      },
      take: 1,
      orderBy: {
        createdAt: "desc",
      },
    });
    await prisma.workoutLog.updateMany({
      where: {
        workoutId: state.workoutId,
      },
      data: {
        analysed: true,
      },
    });
    const workoutData = {
      workoutLog: workoutLog[0],
      pastWorkoutLogs,
    };
    state.rawData = JSON.stringify(workoutData);
    return state;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Something went wrong while retrieving analysis and workout log."
    );
  }
};

const analyseWorkoutData = async (state: typeof StateAnnotation.State) => {
  try {
    console.log(state.rawData);
    const response = await llm
      .withStructuredOutput(ResponseFormatter)
      .invoke(
        `You are a workout and exercises expert.First analyse the past workouts given to you, understand how the user is performing over the time horizon, when did he last hit this muscle (if he is hitting the same muscle very frequently, it will lead to a higher fatigue index), understand his weight lifting pattern, understand his level, when and only when you have completely done that, analyse current workout data and return the response accordingly. Consider every possible fact into account, make sure to scan through all the previous analyses, see how long the gap was after the previous workout and how were the weights lifted in the previous workout, generate a trend of the progress, if the person is progressing in the weight, it means he is improving and probably more fatgued. Search the whole internet, gather fitness facts and data and apply every algorithm you can think of on this huge data, as I give you more and more data, become even better. Calculate the field accordingly, you need to calculate almost every field. The past analyses may or may not be present as the user can perform that workout for the first time. Don't give lame advices, give advice and back it by data, generate interesting facts about the exercises. If past analyses is present, use that to compare and if not present, analyse only on the basis of workoutLog: \n\n ${state.rawData}.`
      );
    state.analysedData = JSON.stringify(response);
    console.log("ANALYSIS DONE!!!!! ->>>", response);
    return state;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while analysing workout data.");
  }
};

const saveAnalysisToDB = async (state: typeof StateAnnotation.State) => {
  try {
    const analysedData: AnalysedData = JSON.parse(state.analysedData);
    const createdAnalysis = await prisma.workoutAnalysis.create({
      data: {
        ...analysedData,
        workoutId: state.workoutId,
        userId: state.userId,
      },
    });
    state.analysedData = JSON.stringify(createdAnalysis);
    return state;
  } catch (error) {
    console.error(error);
    throw new Error(
      "Something went wrong while saving the analysis to database."
    );
  }
};

const workflow = new StateGraph(StateAnnotation);

workflow.addNode("retrieve", retrieveWorkoutAnalyses);
workflow.addNode("analyse", analyseWorkoutData);
workflow.addNode("save", saveAnalysisToDB);

workflow.addEdge(START, "retrieve");
workflow.addEdge("retrieve", "analyse");
workflow.addEdge("analyse", "save");
workflow.addEdge("save", END);

const analysisAgent = workflow.compile();

export default analysisAgent;
