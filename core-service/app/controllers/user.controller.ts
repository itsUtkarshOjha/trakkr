import { User } from "@clerk/remix/ssr.server";
import { prisma } from "prisma/db";
import { sendNotification } from "rabbitmq/sendNotification";
import { NotificationBody } from "~/lib/interfaces";
import { generateNotificationBody } from "~/lib/utils";

export const findUser = async (clerkId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async (clerkId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user.");
  }
};

export const createUser = async (clerkUser: User) => {
  try {
    const createdUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        firstName: clerkUser.firstName as string,
        lastName: clerkUser.lastName,
        emailId: clerkUser.emailAddresses[0].emailAddress as string,
      },
    });
    const notificationHTML = generateNotificationBody(createdUser.firstName);
    const notificationBody: NotificationBody = {
      html: notificationHTML,
      emailId: createdUser.emailId,
    };
    await sendNotification(notificationBody.toString());
    return createdUser;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user.");
  }
};
