import { NOTIFICATION_QUEUE } from "../lib/constants";
import { sendNotification } from "../nodemailer/sendNotification";
import { Channel } from "amqplib";
import mqConnection from "./connection";

const handleSendNotification = async (message: Buffer, channel: Channel) => {
  try {
    const messageString = message.toString();
    const notificationDetails: { html: string; emailId: string } =
      JSON.parse(messageString);
    await sendNotification(
      notificationDetails.html,
      notificationDetails.emailId
    );
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while sending notification.");
  }
};

export const listenForNotifications = async () => {
  try {
    console.log("Listening for notifications.");
    await mqConnection.connect(NOTIFICATION_QUEUE);
    await mqConnection.consume(NOTIFICATION_QUEUE, handleSendNotification);
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong.");
  }
};
