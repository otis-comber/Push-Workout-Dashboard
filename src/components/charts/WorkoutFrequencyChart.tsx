import { useWorkoutFrequency } from "@/hooks/useWorkoutFrequency";
import { LineChart } from "@/components/charts/LineChart";

export function WorkoutFrequencyChart() {
  const { monthly } = useWorkoutFrequency();

  if (!monthly) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-6 shadow-2xl shadow-black/50 backdrop-blur">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Workouts per Month
      </h2>
      <LineChart
        labels={monthly.labels}
        data={monthly.counts}
        seriesLabel="Workouts"
      />
    </div>
  );
}
