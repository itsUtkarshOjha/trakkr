import { redirect } from "@remix-run/node";
import cloudinary from ".";
import { uploadImageToDB } from "../controllers/image.controller";

export const uploadImage = async (
  userId: string,
  workoutLogId: string,
  image: string
) => {
  try {
    const uploadedImage = await cloudinary.uploader.upload(image);
    await uploadImageToDB(
      userId,
      workoutLogId,
      uploadedImage.url,
      uploadedImage.public_id
    );
    console.log("Image upload successful");
    return redirect(`/analysis?log=${workoutLogId}`);
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while uploading the image.");
  }
};
