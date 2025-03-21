import { transporter } from "./transporter";
import dotenv from "dotenv";
dotenv.config();

export const sendNotification = async (html: string, emailId: string) => {
  try {
    await transporter.sendMail({
      from: `Trakkr <${process.env.SMTP_USERNAME}>`,
      to: emailId,
      subject: "Hi from Trakkr!",
      html,
    });
    console.log("Notification sent!");
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while sending the notification.");
  }
};
