import { IMAGE_DETAILS_QUEUE } from "~/lib/constants";
import mqConnection from "./connection";
import { Channel } from "amqplib";
import { uploadImageToDB } from "~/controllers/image.controller";

const handleUploadImageToDB = async (message: Buffer, channel: Channel) => {
  try {
    const detailsString = message.toString();
    const imageDetails = JSON.parse(detailsString);
    const { public_id, imageUrl, userId, workoutLogId } = imageDetails;
    console.log("Saving image...");
    const image = await uploadImageToDB(
      userId,
      workoutLogId,
      imageUrl,
      public_id
    );
    console.log("Image saved successfully.");
    channel.ack(message);
    return image;
  } catch (error) {
    console.error(error);
  }
};

export const listenForImages = async () => {
  try {
    await mqConnection.connect(IMAGE_DETAILS_QUEUE);
    await mqConnection.consume(IMAGE_DETAILS_QUEUE, handleUploadImageToDB);
  } catch (error) {
    console.error(error);
  }
};
