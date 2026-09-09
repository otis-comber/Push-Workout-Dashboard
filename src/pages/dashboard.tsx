import { WorkoutFrequencyChart } from "@/components/dashboard/WorkoutFrequencyChart";
import { WorkoutsTable } from "@/components/dashboard/WorkoutsTable";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-black px-12 py-12">
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Workout Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <WorkoutsTable />
          <WorkoutFrequencyChart />
        </div>
      </div>
    </main>
  );
}
