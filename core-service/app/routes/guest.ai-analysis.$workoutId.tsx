import { MetaFunction } from "@remix-run/node";
import AnalysisStatSmallBox from "~/components/analysis-stat-small-box";
import FatigueIndex from "~/components/fatigue-index-chart";
import HeadingSubheading from "~/components/heading-subheading";
import Progression from "~/components/progression-chart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";

const latestAnalysis = {
  id: "wa-009",
  userId: "user-123",
  workoutId: "w-009",
  totalSets: 12,
  totalReps: 100,
  totalVolume: 7800.0,
  avgWeight: 72.5,
  maxWeight: 105.0,
  avgRepsPerSet: 8.6,
  progression: 1.6,
  fatigueIndex: 0.33,
  estimatedCaloriesBurned: 370,
  musclesTargetted: ["Core", "Legs"],
  suggestions: [
    "Low fatigue (0.33), allowing for progressive overload. Increase plank duration by 15 seconds and add resistance for additional core activation benefits.",
    "Increase deadlift accessory work, focusing on Romanian deadlifts and hamstring curls to improve posterior chain endurance and overall lower body stability.",
  ],
  createdAt: new Date("2024-03-09T16:00:00.000Z"),
};

const pastAnalyses = [
  {
    id: "wa-001",
    userId: "user-123",
    workoutId: "w-001",
    totalSets: 15,
    totalReps: 120,
    totalVolume: 9500.0,
    avgWeight: 80.5,
    maxWeight: 120.0,
    avgRepsPerSet: 8.0,
    progression: 2.5,
    fatigueIndex: 0.75,
    estimatedCaloriesBurned: 400,
    musclesTargetted: ["Chest", "Shoulders", "Triceps"],
    suggestions: [
      "Fatigue index is 0.75, indicating high exertion. Reduce set volume slightly or increase rest time between heavy pressing movements to sustain strength progression.",
    ],
    createdAt: new Date("2024-03-01T12:00:00.000Z"),
  },
  {
    id: "wa-002",
    userId: "user-123",
    workoutId: "w-002",
    totalSets: 18,
    totalReps: 140,
    totalVolume: 12000.0,
    avgWeight: 90.2,
    maxWeight: 140.0,
    avgRepsPerSet: 7.8,
    progression: 3.0,
    fatigueIndex: 0.62,
    estimatedCaloriesBurned: 450,
    musclesTargetted: ["Legs", "Glutes", "Lower Back"],
    suggestions: [
      "Moderate fatigue (0.62) suggests good recovery. Slightly increase squat intensity next session to push hypertrophy without compromising endurance or joint health.",
    ],
    createdAt: new Date("2024-03-02T12:30:00.000Z"),
  },
  {
    id: "wa-003",
    userId: "user-123",
    workoutId: "w-003",
    totalSets: 12,
    totalReps: 100,
    totalVolume: 8500.0,
    avgWeight: 75.0,
    maxWeight: 110.0,
    avgRepsPerSet: 8.3,
    progression: 1.8,
    fatigueIndex: 0.41,
    estimatedCaloriesBurned: 380,
    musclesTargetted: ["Back", "Biceps"],
    suggestions: [
      "Low fatigue (0.41) and stable progression indicate room for volume increase. Add an extra back-off set on rows for improved lat activation and hypertrophy.",
    ],
    createdAt: new Date("2024-03-03T13:00:00.000Z"),
  },
  {
    id: "wa-004",
    userId: "user-123",
    workoutId: "w-004",
    totalSets: 20,
    totalReps: 160,
    totalVolume: 13500.0,
    avgWeight: 95.5,
    maxWeight: 150.0,
    avgRepsPerSet: 8.5,
    progression: 3.2,
    fatigueIndex: 0.88,
    estimatedCaloriesBurned: 500,
    musclesTargetted: ["Legs", "Core"],
    suggestions: [
      "Fatigue is high (0.88), indicating possible overtraining. Reduce deadlift volume slightly or prioritize recovery strategies like mobility drills and active stretching.",
    ],
    createdAt: new Date("2024-03-04T13:30:00.000Z"),
  },
  {
    id: "wa-005",
    userId: "user-123",
    workoutId: "w-005",
    totalSets: 10,
    totalReps: 90,
    totalVolume: 7000.0,
    avgWeight: 70.0,
    maxWeight: 100.0,
    avgRepsPerSet: 9.0,
    progression: 1.5,
    fatigueIndex: 0.29,
    estimatedCaloriesBurned: 350,
    musclesTargetted: ["Chest", "Triceps"],
    suggestions: [
      "Fatigue is minimal (0.29), indicating strong recovery. Maintain current load but increase bench press reps to further improve endurance and muscular output.",
    ],
    createdAt: new Date("2024-03-05T14:00:00.000Z"),
  },
  {
    id: "wa-006",
    userId: "user-123",
    workoutId: "w-006",
    totalSets: 22,
    totalReps: 180,
    totalVolume: 14500.0,
    avgWeight: 100.5,
    maxWeight: 160.0,
    avgRepsPerSet: 8.2,
    progression: 4.0,
    fatigueIndex: 0.92,
    estimatedCaloriesBurned: 520,
    musclesTargetted: ["Legs", "Glutes", "Hamstrings"],
    suggestions: [
      "Very high fatigue (0.92), meaning excessive load accumulation. Consider a deload session next week to prevent overuse injuries and optimize muscle recovery.",
    ],
    createdAt: new Date("2024-03-06T14:30:00.000Z"),
  },
  {
    id: "wa-007",
    userId: "user-123",
    workoutId: "w-007",
    totalSets: 14,
    totalReps: 110,
    totalVolume: 9300.0,
    avgWeight: 85.0,
    maxWeight: 125.0,
    avgRepsPerSet: 7.9,
    progression: 2.2,
    fatigueIndex: 0.55,
    estimatedCaloriesBurned: 410,
    musclesTargetted: ["Back", "Biceps", "Forearms"],
    suggestions: [
      "Fatigue (0.55) is in a manageable range. Maintain current intensity but add grip-strength exercises to enhance deadlift lockout and pulling efficiency.",
    ],
    createdAt: new Date("2024-03-07T15:00:00.000Z"),
  },
  {
    id: "wa-008",
    userId: "user-123",
    workoutId: "w-008",
    totalSets: 16,
    totalReps: 130,
    totalVolume: 10000.0,
    avgWeight: 88.5,
    maxWeight: 130.0,
    avgRepsPerSet: 8.1,
    progression: 2.7,
    fatigueIndex: 0.68,
    estimatedCaloriesBurned: 430,
    musclesTargetted: ["Shoulders", "Triceps"],
    suggestions: [
      "Moderate fatigue (0.68), suggesting good workload management. Maintain overhead press load but focus on controlled eccentric reps for better hypertrophy.",
    ],
    createdAt: new Date("2024-03-08T15:30:00.000Z"),
  },
  {
    id: "wa-009",
    userId: "user-123",
    workoutId: "w-009",
    totalSets: 12,
    totalReps: 100,
    totalVolume: 7800.0,
    avgWeight: 72.5,
    maxWeight: 105.0,
    avgRepsPerSet: 8.6,
    progression: 1.6,
    fatigueIndex: 0.33,
    estimatedCaloriesBurned: 370,
    musclesTargetted: ["Core", "Legs"],
    suggestions: [
      "Low fatigue (0.33), allowing for progressive overload. Increase plank duration by 15 seconds and add resistance for additional core activation benefits.",
      "Increase deadlift accessory work, focusing on Romanian deadlifts and hamstring curls to improve posterior chain endurance and overall lower body stability.",
    ],
    createdAt: new Date("2024-03-09T16:00:00.000Z"),
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | AI Analysis" },
    {
      name: "AI Analysis",
      content: "AI analysis of your selected workout.",
    },
  ];
};

export default function AIAnalysisWorkout() {
  return (
    <div className="w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/guest/ai-analysis">
              AI Analysis
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeadingSubheading
        heading="AI Analysis"
        subheading="Based on your latest log for this workout. The graphs,
        'Calories Burnt' and suggestions update everytime you run the analysis."
      />
      <div className="grid grid-cols-2 xl:grid-cols-5 grid-rows-12 sm:grid-rows-11 xl:grid-rows-4 gap-4 sm:gap-6 mt-12">
        <AnalysisStatSmallBox
          heading="Fatigue Index"
          value={latestAnalysis.fatigueIndex}
        />
        <AnalysisStatSmallBox
          heading="Progression"
          value={latestAnalysis.progression}
        />
        <AnalysisStatSmallBox
          heading="Avg Reps / Set"
          value={latestAnalysis.avgRepsPerSet}
        />
        <AnalysisStatSmallBox
          heading="Total Volume (kgs)"
          value={latestAnalysis.totalVolume}
        />
        <AnalysisStatSmallBox
          heading="Max Weight (kgs)"
          value={latestAnalysis.maxWeight}
          className="col-span-2 xl:col-span-1"
        />
        <div className="col-span-2 row-span-2 bg-primary-foreground rounded-xl">
          <Progression pastAnalyses={pastAnalyses} />
        </div>
        <div className="col-span-2 row-span-2 bg-primary-foreground rounded-xl">
          <FatigueIndex pastAnalyses={pastAnalyses} />
        </div>
        <div className="col-span-2 row-span-3 sm:col-span-1 sm:col-start-2 xl:col-start-5 sm:row-span-2 xl:row-span-3 bg-primary-foreground rounded-xl">
          <div className="bg-primary-foreground h-full rounded-xl px-8 py-6">
            <div className="flex flex-col h-full items-end gap-4 justify-start">
              <h4 className="uppercase tracking-wider text-[10px] sm:text-[12px] font-extralight text-right">
                Calories Burnt
              </h4>
              <div className="flex flex-col items-end">
                {pastAnalyses.map((analysis) => (
                  <p key={analysis.id} className="text-xl font-semibold">
                    {analysis.estimatedCaloriesBurned?.toFixed(2)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 row-span-1 bg-primary-foreground rounded-xl flex flex-col items-center justify-center">
          <p className="font-light px-4 py-3 text-sm text-center">
            {latestAnalysis.suggestions[0]}
          </p>
        </div>
        <div className="col-span-2 row-span-1 bg-primary-foreground rounded-xl flex flex-col items-center justify-center">
          <p className="font-light px-4 text-sm text-center">
            {latestAnalysis.suggestions[1]}
          </p>
        </div>
      </div>
    </div>
  );
}
