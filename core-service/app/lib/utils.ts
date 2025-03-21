import { User } from "@clerk/remix/ssr.server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClerkClient } from "@clerk/remix/api.server";
import { Set } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getClerkUser = async (userId: string): Promise<User> => {
  const clerkUser = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.getUser(userId);
  return clerkUser;
};

export const calculateOneRepMax = (sets: Set[]): number => {
  let oneRepMax: number = 0;
  sets.forEach((set) => {
    const { reps, weightLifted } = set;
    const tempOneRepMax = weightLifted / (1.033 - 0.033 * reps);
    oneRepMax = Math.max(oneRepMax, tempOneRepMax);
  });
  return oneRepMax;
};

export const generateNotificationBody = (
  firstName: string,
  workoutName?: string
) => {
  if (workoutName) {
    return `
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
                <title>Workout Reminder</title>
                <style>
                    body {      
                        font-family: DM Sans, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    h2 {
                        color: #333;
                    }
                    p {
                        color: #555;
                        font-size: 16px;
                    }
                    .button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: #28a745;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Workout Reminder</h2>
                    <p>Hi ${firstName}! Just a reminder that you have a workout scheduled for tomorrow.</p>
                    <p><strong>Workout:</strong> ${workoutName}</p>
                    <a href="https://trakkr.in/workouts" class="button">View Details</a>
                    <p class="footer">Stay consistent and keep pushing towards your goals!</p>
                </div>
            </body>
        </html>
        `;
  } else {
    return `
       <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
        <title>Welcome to Trakkr!</title>
        <style>
            body {      
                font-family: DM Sans, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h2 {
                color: #333;
            }
            p {
                color: #555;
                font-size: 16px;
            }
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Welcome to Trakkr, ${firstName}!</h2>
            <p>We're excited to have you on board. Trakkr is here to help you log your workouts, track progress, and stay motivated.</p>
            <p>Start by adding your first workout and set your fitness goals!</p>
            <a href="https://trakkr.in/create-workout" class="button">Get Started</a>
            <p class="footer">Stay consistent and keep pushing towards your goals! 🚀</p>
        </div>
    </body>
</html>`;
  }
};
