import { NOTIFICATION_QUEUE } from "~/lib/constants";
import mqConnection from "./connection";

export const sendNotification = async (message: string) => {
  try {
    await mqConnection.sendMessage(NOTIFICATION_QUEUE, message);
    console.log("Notification sent successfully.");
  } catch (error) {
    console.error(error);
    console.error("Error sending notification.");
  }
};
