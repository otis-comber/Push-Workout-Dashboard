import { useLiftProgress } from "@/hooks/useLiftProgress";
import { MultiLineChart } from "@/components/charts/MultiLineChart";

export function LiftProgressChart() {
  const { series, chartStart } = useLiftProgress();

  if (!series) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-6 shadow-2xl shadow-black/50 backdrop-blur">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Lift Progress
      </h2>
      <MultiLineChart series={series} xMin={chartStart} />
    </div>
  );
}
