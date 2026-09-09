import type { IWorkout } from "@/models/Workout";

export const MAIN_LIFTS = [
  "Barbell Back Squat",
  "Barbell Bench Press",
  "Barbell Deadlift",
  "Barbell Front Squat",
  "Barbell Standing Overhead Press",
  "Barbell Incline Bench Press",
];

// Dataviz reference categorical order, dark-mode steps — fixed, never reorder/cycle.
export const MAIN_LIFT_COLORS: Record<string, string> = {
  "Barbell Back Squat": "#3987e5", // blue
  "Barbell Bench Press": "#d95926", // orange
  "Barbell Deadlift": "#199e70", // aqua
  "Barbell Front Squat": "#c98500", // yellow
  "Barbell Standing Overhead Press": "#d55181", // magenta
  "Barbell Incline Bench Press": "#008300", // green
};

export const DEFAULT_LIFT_PROGRESS_START = new Date("2026-04-01").getTime();
export const DEFAULT_WORKOUT_FREQUENCY_START = new Date(2026, 2, 1);

export interface PersonalBest {
  exercise: string;
  oneRepMax: number;
  weight: number;
  reps: number;
  date: Date;
}

export function getPersonalBests(workouts: IWorkout[]): PersonalBest[] {
  const bestByExercise = workouts
    .flatMap((workout) =>
      workout.exercises.flatMap((exercise) =>
        exercise.sets.map((set) => ({
          exercise: exercise.exercise,
          oneRepMax: set.estimatedOneRepMaxKg,
          weight: set.weight,
          reps: set.reps,
          date: workout.startTime,
        })),
      ),
    )
    .filter((record) => MAIN_LIFTS.includes(record.exercise))
    .reduce(
      (acc, record) => {
        acc[record.exercise] =
          !acc[record.exercise] ||
          record.oneRepMax > acc[record.exercise].oneRepMax
            ? record
            : acc[record.exercise];
        return acc;
      },
      {} as Record<string, PersonalBest>,
    );

  return Object.values(bestByExercise);
}

export interface LiftProgressSeries {
  label: string;
  color: string;
  points: { x: number; y: number }[];
}

interface SessionBest {
  exercise: string;
  timestamp: number;
  oneRepMax: number;
}

export function getLiftProgressSeries(
  workouts: IWorkout[],
  startTimestamp: number = DEFAULT_LIFT_PROGRESS_START,
): LiftProgressSeries[] {
  const bestBySession = workouts
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
        MAIN_LIFTS.includes(record.exercise) &&
        record.timestamp >= startTimestamp,
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

  return Object.entries(pointsByExercise).map(([exercise, points]) => ({
    label: exercise,
    color: MAIN_LIFT_COLORS[exercise],
    points: points.sort((a, b) => a.x - b.x),
  }));
}

export interface MonthlyWorkoutCounts {
  labels: string[];
  counts: number[];
}

export function getWorkoutsPerMonth(
  workouts: IWorkout[],
  startDate: Date = DEFAULT_WORKOUT_FREQUENCY_START,
): MonthlyWorkoutCounts {
  const countsByMonth = workouts
    .filter((workout) => new Date(workout.startTime) >= startDate)
    .reduce(
      (acc, workout) => {
        const date = new Date(workout.startTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const key = `${year}-${month}`;

        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  const sortedEntries = Object.entries(countsByMonth).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return {
    labels: sortedEntries.map(([key]) => key),
    counts: sortedEntries.map(([, count]) => count),
  };
}
