import { prisma } from "prisma/db";

export const setDate = async (date: string, weightId: string) => {
  try {
    await prisma.weight.update({
      where: {
        id: weightId,
      },
      data: {
        recordedAt: date,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while updating the date.");
  }
};

export const deleteWeights = async (userId: string, weightId: string) => {
  try {
    await prisma.weight.delete({
      where: {
        userId,
        id: weightId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while deleting the logged weight.");
  }
};

export const getWeights = async (userId: string, skip?: number) => {
  try {
    const weightCount = await prisma.weight.count({
      where: {
        userId,
      },
    });
    const weights = await prisma.weight.findMany({
      where: {
        userId,
      },
      orderBy: {
        recordedAt: "desc",
      },
      take: 20,
      skip: skip || 0,
    });
    return { weights, weightCount };
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching weights.");
  }
};

export const getTargetWeight = async (userId: string) => {
  try {
    const userWithTargetWeight = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        targetWeight: true,
      },
    });
    return userWithTargetWeight?.targetWeight || -1;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching target weight.");
  }
};

export const logWeight = async (userId: string, weight: number) => {
  try {
    const createdWeight = await prisma.weight.create({
      data: {
        userId,
        value: weight,
      },
    });
    return createdWeight;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while logging the weight.");
  }
};

export const setTargetWeight = async (userId: string, weight: number) => {
  try {
    const updatedTargetWeight = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        targetWeight: weight,
      },
      select: {
        targetWeight: true,
      },
    });
    return updatedTargetWeight.targetWeight;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while setting the target weight.");
  }
};
