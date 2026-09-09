import { LiftProgressChart } from "@/components/charts/LiftProgressChart";
import { WorkoutFrequencyChart } from "@/components/charts/WorkoutFrequencyChart";
import { PersonalBestsTable } from "@/components/tables/PersonalBestsTable";
import { WorkoutsTable } from "@/components/tables/WorkoutsTable";
import { Spinner } from "@/components/Spinner";
import { useWorkouts } from "@/lib/workouts";

export function Dashboard() {
  const { isLoading, isError } = useWorkouts();

  return (
    <main className="min-h-screen bg-black px-12 py-12">
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Workout Dashboard
          </h1>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Spinner />
            <p className="text-sm text-gray-400">Loading…</p>
          </div>
        )}
        {isError && <p className="text-red-400">Error loading data</p>}

        {!isLoading && !isError && (
          <div className="grid grid-cols-2 gap-6">
            <WorkoutsTable />
            <PersonalBestsTable />
            <div className="col-span-2 flex flex-col gap-6">
              <LiftProgressChart />
              <WorkoutFrequencyChart />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
