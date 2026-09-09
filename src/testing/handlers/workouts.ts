import { http, HttpResponse } from "msw";
import type { IWorkout } from "@/models/Workout";

export const workoutsHandler = (result: IWorkout[]) =>
  http.get("/api/workouts", () => HttpResponse.json({ result }));

export const errorWorkoutsHandler = (status = 500) =>
  http.get("/api/workouts", () =>
    HttpResponse.json({ error: "failed to load data" }, { status }),
  );
