import { WorkoutsTable } from "@/components/dashboard/WorkoutsTable";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-black px-12 py-12">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Workout Dashboard
          </h1>
        </div>

        <WorkoutsTable />
      </div>
    </main>
  );
}
