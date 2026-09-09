import { useMemo } from "react";
import { useWorkouts } from "@/lib/workouts";
import { getPersonalBests } from "@/lib/workouts/transforms";

export function usePersonalBests() {
  const { data, isLoading, isError } = useWorkouts();

  const personalBests = useMemo(
    () => (data ? getPersonalBests(data) : undefined),
    [data],
  );

  return { personalBests, isLoading, isError };
}
