import { useWorkouts } from "@/lib/workouts";
import type { IWorkout } from "@/models/Workout";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<IWorkout>();

const columns = [
  columnHelper.accessor("name", {
    header: "Workout",
    cell: (info) => (
      <span className="font-medium text-white">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("startTime", {
    header: "Workout Date",
    cell: (info) =>
      new Date(info.getValue()).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
  }),
  columnHelper.accessor("completedSets", {
    header: "Completed Sets",
    cell: (info) => (
      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("volumeKg", {
    header: "Volume",
    cell: (info) => (
      <span className="font-mono tabular-nums text-gray-200">
        {info.getValue().toLocaleString()} kg
      </span>
    ),
  }),
];

export default function Dashboard() {
  const { data, isLoading, isError } = useWorkouts();

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-gray-400">Loading…</p>
      </main>
    );
  }
  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-red-400">Error loading data</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-12 py-12">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Workout Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {data?.length ?? 0} workouts logged
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3 shadow-2xl shadow-black/50 backdrop-blur">
          <div className="h-1 bg-linear-to-r from-emerald-400 via-cyan-400 to-indigo-500" />
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/2">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-white/4">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-300"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-300"
          >
            Previous
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
