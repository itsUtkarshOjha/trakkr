import { IMAGE_UPLOAD_QUEUE } from "~/lib/constants";
import mqConnection from "./connection";

export const sendImage = async (imageDetails: string) => {
  try {
    await mqConnection.sendMessage(IMAGE_UPLOAD_QUEUE, imageDetails);
    console.log("Image sent successfully.");
  } catch (error) {
    console.error(error);
    console.error("Error sending Image.");
  }
};
