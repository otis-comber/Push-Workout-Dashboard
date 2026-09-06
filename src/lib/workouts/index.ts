import { useQuery } from "@tanstack/react-query";

export async function fetchWorkouts() {
  const res = await fetch("/api/workouts");

  if (!res.ok) {
    throw new Error("Failed to fetch workouts");
  }

  const data = await res.json();
  return data.result;
}

export function useWorkouts() {
  return useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });
}
