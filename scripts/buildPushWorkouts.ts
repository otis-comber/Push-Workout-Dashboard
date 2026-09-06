import fs from "node:fs/promises";
import path from "node:path";

interface CalendarDay {
  date: string;
  workouts: CalendarWorkout[];
}
interface CalendarWorkout {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  completedSets: number;
  volumeKg: number;
  muscles: string[];
  exercises: string[];
}

interface ExerciseHistoryFile {
  exerciseName: string;
  sessions: ExerciseSession[];
}

interface ExerciseSession {
  date: string;
  workout: string;
  exercise: string;
  masterId: string;
  equipment: string;
  mainTargets: string[];
  completedSets: number;
  volumeKg: number;
  sets: {
    id: string;
    reps: number;
    weight: number;
    unit: string;
    rir: number | null;
    pb: boolean;
    estimatedOneRepMaxKg: number;
  }[];
}

async function main() {
  const raw = await fs.readFile("data/push-raw/calendar-all.json", "utf-8");
  const pushWorkouts = JSON.parse(raw) as CalendarDay[];

  const calendarWorkouts = pushWorkouts.flatMap((day) => day.workouts);

  const historyDir = "data/push-raw/exercise-history";
  const files = await fs.readdir(historyDir);

  const historyFiles = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(historyDir, file);
      const raw = await fs.readFile(fullPath, "utf-8");
      return JSON.parse(raw) as ExerciseHistoryFile;
    }),
  );

  const allSessions = historyFiles.flatMap((file) => file.sessions);

  const workoutsWithExercises = calendarWorkouts.map((workout) => {
    const matchingSessions = allSessions.filter(
      (session) => session.date === workout.endTime,
    );

    return {
      ...workout,
      exercises: matchingSessions.map((session) => {
        const { date, workout, ...restOfSession } = session;
        return restOfSession;
      }),
    };
  });

  await fs.writeFile(
    "data/push-workouts-full.json",
    JSON.stringify(workoutsWithExercises, null, 2),
    "utf-8",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
