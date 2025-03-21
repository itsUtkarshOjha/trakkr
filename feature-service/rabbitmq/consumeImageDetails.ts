import { UploadApiResponse } from "cloudinary";
import { uploadImage } from "../cloudinary/imageUpload";
import { Channel } from "amqplib";
import { IMAGE_DETAILS_QUEUE, IMAGE_UPLOAD_QUEUE } from "../lib/constants";
import mqConnection from "./connection";

const handleUploadImage = async (message: Buffer, channel: Channel) => {
  try {
    const messageString = message.toString();
    const imageDetails: {
      imageString: string;
      workoutLogId: string;
      userId: string;
    } = JSON.parse(messageString);
    const { imageString, workoutLogId, userId } = imageDetails;
    const image = Buffer.from(imageString, "base64");
    const imageResponse = (await uploadImage(image)) as UploadApiResponse;
    const { public_id, url: imageUrl } = imageResponse;
    const imageDetailsToSend = JSON.stringify({
      public_id,
      imageUrl,
      userId,
      workoutLogId,
    });
    await mqConnection.sendToQueue(IMAGE_DETAILS_QUEUE, imageDetailsToSend);
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while uploading the image.");
  }
};

export const listenForImages = async () => {
  try {
    console.log("Listening for images...");
    await mqConnection.connect(IMAGE_UPLOAD_QUEUE);
    await mqConnection.consume(IMAGE_UPLOAD_QUEUE, handleUploadImage);
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while consuming messages.");
  }
};
