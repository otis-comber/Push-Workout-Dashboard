import { useMemo } from "react";
import { useWorkouts } from "@/lib/workouts";
import { getWorkoutsPerMonth } from "@/lib/workouts/transforms";

export function useWorkoutFrequency() {
  const { data, isLoading, isError } = useWorkouts();

  const monthly = useMemo(
    () => (data ? getWorkoutsPerMonth(data) : undefined),
    [data],
  );

  return { monthly, isLoading, isError };
}
