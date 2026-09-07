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

  // TODO: group `data` into monthly counts.
  const labels: string[] = [];
  const counts: number[] = [];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-6 shadow-2xl shadow-black/50 backdrop-blur">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Workouts per Month
      </h2>
      <LineChart labels={labels} data={counts} seriesLabel="Workouts" />
    </div>
  );
}
