import { prisma } from "prisma/db";

export const getPastAnalyses = async (workoutId: string, userId: string) => {
  try {
    const analyses = await prisma.workoutAnalysis.findMany({
      where: {
        workoutId,
        userId,
      },
      include: {
        Workout: {
          select: {
            workoutName: true,
          },
        },
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });
    return analyses;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching the analysis.");
  }
};
