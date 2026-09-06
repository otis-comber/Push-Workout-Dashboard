import fs from "node:fs/promises";
import { dbConnect } from "@/lib/db/connect";
import Workout from "@/models/Workout";

interface RawPushSet {
  id: string;
  reps: number;
  weight: number;
  unit: string;
  rir: number | null;
  pb: boolean;
  estimatedOneRepMaxKg: number;
}

interface RawPushExercise {
  exercise: string;
  masterId: string | null; // null in practice, e.g. an exercise logged with 0 completed sets
  equipment: string;
  mainTargets: string[];
  completedSets: number;
  volumeKg: number;
  sets: RawPushSet[];
}

interface RawPushWorkout {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  completedSets: number;
  volumeKg: number;
  muscles: string[];
  exercises: RawPushExercise[];
}

async function main() {
  const raw = await fs.readFile("data/push-sample-workout.json", "utf-8");
  const pushWorkouts = JSON.parse(raw) as RawPushWorkout[];

  const mapped = pushWorkouts.map((rawWorkout) => {
    const { id, exercises, ...restOfWorkout } = rawWorkout;
    return {
      pushId: id,
      ...restOfWorkout,
      exercises: exercises.map((rawExercise) => {
        // no id at this level — nothing to rename, just pass it through
        const { sets, ...restOfExercise } = rawExercise;
        return {
          ...restOfExercise,
          sets: sets.map((rawSet) => {
            const { id: setId, ...restOfSet } = rawSet;
            return {
              pushId: setId,
              ...restOfSet,
            };
          }),
        };
      }),
    };
  });

  await dbConnect();
  await Workout.insertMany(mapped);
  console.log(`Inserted ${mapped.length} workout(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
