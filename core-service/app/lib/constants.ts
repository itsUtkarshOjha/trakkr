import {
  LayoutDashboard,
  Dumbbell,
  PlusCircle,
  GaugeCircle,
  MessageCircle,
  BrainCircuit,
} from "lucide-react";

export const sections = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    link: "/dashboard",
  },
];

export const weight = [
  {
    title: "Weight Tracker",
    icon: GaugeCircle,
    link: "/weight",
  },
];

export const workouts = [
  {
    title: "Your Workouts",
    icon: Dumbbell,
    link: "/workouts",
  },
  {
    title: "Create a Workout",
    icon: PlusCircle,
    link: "/create-workout",
  },
  // {
  //   title: "Analysis",
  //   icon: Brain,
  //   link: "/analysis",
  // },
];

export const smartFeatures = [
  {
    title: "AI Analysis",
    icon: BrainCircuit,
    link: "/ai-analysis/select",
  },
  {
    title: "AI Chat",
    icon: MessageCircle,
    link: "/ai-chat",
  },
];

export const days = [
  {
    day: "Monday",
    dayShort: "Mon",
  },
  {
    day: "Tuesday",
    dayShort: "Tue",
  },
  {
    day: "Wednesday",
    dayShort: "Wed",
  },
  {
    day: "Thursday",
    dayShort: "Thu",
  },
  {
    day: "Friday",
    dayShort: "Fri",
  },
  {
    day: "Saturday",
    dayShort: "Sat",
  },
  {
    day: "Sunday",
    dayShort: "Sun",
  },
];

export const dayToIndex = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const indexToDay = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  0: "Sunday",
};

export const features = [
  {
    number: "01",
    feature:
      "Log your sets, reps, and weights effortlessly—no distractions, just progress. Upload your images after you are done.",
    image: "/ongoing-workout.png",
  },
  {
    number: "02",
    feature:
      "Customize your workouts with ease—structure your training, add exercises, and stay consistent.",
    image: "/creating-workout.png",
  },
  {
    number: "03",
    feature:
      "Track your strength gains over time with an intuitive dashboard and one-rep max progression graph.",
    image: "/dashboard.png",
  },
  {
    number: "04",
    feature:
      "Monitor body weight trends to complement your training and optimize your fitness journey.",
    image: "/weight-tracker.png",
  },
  {
    number: "05",
    feature:
      "Unlock deep insights into your performance with AI-driven workout analysis, tracking fatigue, progress, and recovery. (currently paused)",
    image: "/ai-analysis.png",
  },
];

export const fitnessFacts = [
  "Exercise releases endorphins—your brain’s way of saying 'Nice job, keep going!'",
  "Lifting weights boosts metabolism, so you burn calories even while doing nothing. Nice!",
  "Protein burns more calories to digest, so eating chicken is kinda like a workout.",
  "A 30-minute walk can boost your mood... and justify an extra snack.",
  "Muscle burns more calories than fat—so lift more, snack guilt-free!",
  "Drinking water before meals = sneaky weight loss hack.",
  "Skipping sleep ruins gains, so yes, naps count as training.",
  "Squats work multiple muscles, like a 'buy one, get five free' deal.",
  "Stretching before bed = fewer morning groans.",
  "You have 600+ muscles, yet leg day still finds the weakest ones!",
];

export const NOTIFICATION_QUEUE = "notificationQueue";
export const IMAGE_UPLOAD_QUEUE = "imageUploadQueue";
export const IMAGE_DETAILS_QUEUE = "imageDetailsQueue";
