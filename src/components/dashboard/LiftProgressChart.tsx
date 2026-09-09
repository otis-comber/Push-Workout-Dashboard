import { useWorkouts } from "@/lib/workouts";
import {
  MultiLineChart,
  type MultiLineSeries,
} from "@/components/charts/MultiLineChart";

const MAIN_LIFTS = [
  "Barbell Back Squat",
  "Barbell Bench Press",
  "Barbell Deadlift",
  "Barbell Front Squat",
  "Barbell Standing Overhead Press",
  "Barbell Incline Bench Press",
];

// Dataviz reference categorical order, dark-mode steps — fixed, never reorder/cycle.
const SERIES_COLORS: Record<string, string> = {
  "Barbell Back Squat": "#3987e5", // blue
  "Barbell Bench Press": "#d95926", // orange
  "Barbell Deadlift": "#199e70", // aqua
  "Barbell Front Squat": "#c98500", // yellow
  "Barbell Standing Overhead Press": "#d55181", // magenta
  "Barbell Incline Bench Press": "#008300", // green
};

interface SessionBest {
  exercise: string;
  timestamp: number;
  oneRepMax: number;
}

const CHART_START = new Date("2026-04-01").getTime();

export function LiftProgressChart() {
  const { data, isLoading, isError } = useWorkouts();

  if (isLoading) {
    return <p className="text-gray-400">Loading…</p>;
  }
  if (isError) {
    return <p className="text-red-400">Error loading data</p>;
  }
  if (!data) {
    return null;
  }

  const bestBySession = data
    .flatMap((workout) =>
      workout.exercises.flatMap((exercise) =>
        exercise.sets.map((set) => ({
          exercise: exercise.exercise,
          timestamp: new Date(workout.startTime).getTime(),
          oneRepMax: set.estimatedOneRepMaxKg,
        })),
      ),
    )
    .filter(
      (record) =>
        MAIN_LIFTS.includes(record.exercise) && record.timestamp >= CHART_START,
    )
    .reduce(
      (acc, record) => {
        const key = `${record.exercise}::${record.timestamp}`;
        acc[key] =
          !acc[key] || record.oneRepMax > acc[key].oneRepMax
            ? record
            : acc[key];
        return acc;
      },
      {} as Record<string, SessionBest>,
    );

  const pointsByExercise = Object.values(bestBySession).reduce(
    (acc, session) => {
      acc[session.exercise] ??= [];
      acc[session.exercise].push({
        x: session.timestamp,
        y: session.oneRepMax,
      });
      return acc;
    },
    {} as Record<string, { x: number; y: number }[]>,
  );

  const series: MultiLineSeries[] = Object.entries(pointsByExercise).map(
    ([exercise, points]) => ({
      label: exercise,
      color: SERIES_COLORS[exercise],
      points: points.sort((a, b) => a.x - b.x),
    }),
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-6 shadow-2xl shadow-black/50 backdrop-blur">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Lift Progress
      </h2>
      <MultiLineChart series={series} xMin={CHART_START} />
    </div>
  );
}
