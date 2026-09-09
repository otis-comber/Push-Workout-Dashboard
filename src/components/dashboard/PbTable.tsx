import { useWorkouts } from "@/lib/workouts";

const MAIN_LIFTS = [
  "Barbell Back Squat",
  "Barbell Bench Press",
  "Barbell Deadlift",
  "Barbell Front Squat",
  "Barbell Standing Overhead Press",
  "Barbell Incline Bench Press",
];

export function PbTable() {
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

  interface LiftRecord {
    exercise: string;
    oneRepMax: number;
    weight: number;
    reps: number;
    date: Date;
  }

  const bestByExercise = data
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
      {} as Record<string, LiftRecord>,
    );

  const personalBests = Object.values(bestByExercise);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3 shadow-2xl shadow-black/50 backdrop-blur">
      <div className="h-1 bg-linear-to-r from-emerald-400 via-cyan-400 to-indigo-500" />
      <div className="p-6 pb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Personal Bests
        </h2>
      </div>
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/2">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              Exercise
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              Est. 1RM
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              Calculation Set
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {personalBests.map((pb) => (
            <tr
              key={pb.exercise}
              className="transition-colors hover:bg-white/4"
            >
              <td className="px-6 py-4 text-sm font-medium text-white">
                {pb.exercise}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
                  {pb.oneRepMax.toFixed(1)} kg
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-mono tabular-nums text-gray-300">
                {pb.weight}kg × {pb.reps}
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {new Date(pb.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
