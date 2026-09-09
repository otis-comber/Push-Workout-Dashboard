import { buildExercise, buildSet, buildWorkout } from "@/testing/fixtures/workouts";
import {
  getLiftProgressSeries,
  getPersonalBests,
  getWorkoutsPerMonth,
} from "./transforms";

describe("getPersonalBests", () => {
  it("keeps the highest estimated 1RM per main lift", () => {
    const workouts = [
      buildWorkout({
        exercises: [
          buildExercise({
            exercise: "Barbell Bench Press",
            sets: [buildSet({ estimatedOneRepMaxKg: 100, weight: 80, reps: 5 })],
          }),
        ],
      }),
      buildWorkout({
        exercises: [
          buildExercise({
            exercise: "Barbell Bench Press",
            sets: [buildSet({ estimatedOneRepMaxKg: 110, weight: 85, reps: 5 })],
          }),
        ],
      }),
    ];

    const result = getPersonalBests(workouts);

    expect(result).toEqual([
      expect.objectContaining({
        exercise: "Barbell Bench Press",
        oneRepMax: 110,
        weight: 85,
        reps: 5,
      }),
    ]);
  });

  it("ignores exercises that aren't tracked main lifts", () => {
    const workouts = [
      buildWorkout({
        exercises: [
          buildExercise({
            exercise: "Machine Lateral Raise",
            sets: [buildSet({ estimatedOneRepMaxKg: 999 })],
          }),
        ],
      }),
    ];

    expect(getPersonalBests(workouts)).toEqual([]);
  });

  it("does not replace the best set on a tie", () => {
    const firstSet = buildSet({ estimatedOneRepMaxKg: 100, weight: 80, reps: 5 });
    const tiedSet = buildSet({ estimatedOneRepMaxKg: 100, weight: 90, reps: 3 });
    const workouts = [
      buildWorkout({
        exercises: [buildExercise({ sets: [firstSet, tiedSet] })],
      }),
    ];

    const [best] = getPersonalBests(workouts);

    expect(best.weight).toBe(80);
  });
});

describe("getLiftProgressSeries", () => {
  it("builds one series per main lift, sorted chronologically", () => {
    const workouts = [
      buildWorkout({
        startTime: new Date("2026-05-02T10:00:00Z"),
        exercises: [
          buildExercise({
            exercise: "Barbell Back Squat",
            sets: [buildSet({ estimatedOneRepMaxKg: 150 })],
          }),
        ],
      }),
      buildWorkout({
        startTime: new Date("2026-05-01T10:00:00Z"),
        exercises: [
          buildExercise({
            exercise: "Barbell Back Squat",
            sets: [buildSet({ estimatedOneRepMaxKg: 140 })],
          }),
        ],
      }),
    ];

    const [series] = getLiftProgressSeries(workouts, 0);

    expect(series.label).toBe("Barbell Back Squat");
    expect(series.points.map((p) => p.y)).toEqual([140, 150]);
    expect(series.points[0].x).toBeLessThan(series.points[1].x);
  });

  it("excludes sessions before the cutoff timestamp", () => {
    const cutoff = new Date("2026-05-01T00:00:00Z").getTime();
    const workouts = [
      buildWorkout({ startTime: new Date("2026-04-30T10:00:00Z") }),
    ];

    expect(getLiftProgressSeries(workouts, cutoff)).toEqual([]);
  });

  it("keeps only the best set within a session", () => {
    const sameSessionTime = new Date("2026-05-01T10:00:00Z");
    const workouts = [
      buildWorkout({
        startTime: sameSessionTime,
        exercises: [
          buildExercise({
            exercise: "Barbell Deadlift",
            sets: [
              buildSet({ estimatedOneRepMaxKg: 180 }),
              buildSet({ estimatedOneRepMaxKg: 190 }),
            ],
          }),
        ],
      }),
    ];

    const [series] = getLiftProgressSeries(workouts, 0);

    expect(series.points).toHaveLength(1);
    expect(series.points[0].y).toBe(190);
  });
});

describe("getWorkoutsPerMonth", () => {
  it("counts workouts by calendar month, sorted ascending", () => {
    const workouts = [
      buildWorkout({ startTime: new Date("2026-05-03T10:00:00Z") }),
      buildWorkout({ startTime: new Date("2026-05-15T10:00:00Z") }),
      buildWorkout({ startTime: new Date("2026-06-01T10:00:00Z") }),
    ];

    const result = getWorkoutsPerMonth(workouts, new Date("2026-01-01"));

    expect(result).toEqual({
      labels: ["2026-05", "2026-06"],
      counts: [2, 1],
    });
  });

  it("excludes workouts before the start date", () => {
    const workouts = [
      buildWorkout({ startTime: new Date("2026-01-01T10:00:00Z") }),
    ];

    const result = getWorkoutsPerMonth(workouts, new Date("2026-02-01"));

    expect(result).toEqual({ labels: [], counts: [] });
  });
});
