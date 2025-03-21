import { prisma } from "prisma/db";

export const deleteImage = async (id: string) => {
  try {
    await prisma.image.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while deleting the image.");
  }
};

export const uploadImageToDB = async (
  userId: string,
  workoutLogId: string,
  imageUrl: string,
  publicId: string
) => {
  try {
    const finalImage = await prisma.image.create({
      data: {
        publicId,
        url: imageUrl,
        userId,
        workoutLogId,
      },
    });
    return finalImage;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while uploading the image.");
  }
};

export const getImagesByWorkoutLog = async (
  workoutLogId: string,
  userId: string
) => {
  try {
    const images = await prisma.image.findMany({
      where: {
        userId,
        workoutLogId,
      },
    });
    return images;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while getting images.");
  }
};
