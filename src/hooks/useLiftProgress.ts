import { useMemo } from "react";
import { useWorkouts } from "@/lib/workouts";
import {
  DEFAULT_LIFT_PROGRESS_START,
  getLiftProgressSeries,
} from "@/lib/workouts/transforms";

export function useLiftProgress() {
  const { data, isLoading, isError } = useWorkouts();

  const series = useMemo(
    () => (data ? getLiftProgressSeries(data) : undefined),
    [data],
  );

  return { series, isLoading, isError, chartStart: DEFAULT_LIFT_PROGRESS_START };
}
