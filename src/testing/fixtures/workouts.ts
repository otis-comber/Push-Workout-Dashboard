import type { IWorkout } from "@/models/Workout";

type WorkoutSet = IWorkout["exercises"][number]["sets"][number];
type WorkoutExercise = IWorkout["exercises"][number];

export function buildSet(overrides: Partial<WorkoutSet> = {}): WorkoutSet {
  return {
    pushId: "set-1",
    reps: 5,
    weight: 100,
    unit: "kg",
    rir: 2,
    pb: false,
    estimatedOneRepMaxKg: 120,
    ...overrides,
  };
}

export function buildExercise(
  overrides: Partial<WorkoutExercise> = {},
): WorkoutExercise {
  return {
    exercise: "Barbell Bench Press",
    masterId: "master-1",
    equipment: "Barbell",
    mainTargets: ["PECS"],
    completedSets: 1,
    volumeKg: 100,
    sets: [buildSet()],
    ...overrides,
  };
}

export function buildWorkout(overrides: Partial<IWorkout> = {}): IWorkout {
  return {
    pushId: "workout-1",
    name: "Push",
    startTime: new Date("2026-05-01T10:00:00Z"),
    endTime: new Date("2026-05-01T11:00:00Z"),
    completedSets: 1,
    volumeKg: 100,
    exercises: [buildExercise()],
    muscles: ["PECS"],
    ...overrides,
  } as IWorkout;
}
