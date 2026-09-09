import { useWorkouts } from "@/lib/workouts";
import { LineChart } from "@/components/charts/LineChart";

export function WorkoutFrequencyChart() {
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

  const countsByMonth = data.reduce(
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

  const labels = sortedEntries.map(([key]) => key);
  const counts = sortedEntries.map(([, count]) => count);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-6 shadow-2xl shadow-black/50 backdrop-blur">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Workouts per Month
      </h2>
      <LineChart labels={labels} data={counts} seriesLabel="Workouts" />
    </div>
  );
}
