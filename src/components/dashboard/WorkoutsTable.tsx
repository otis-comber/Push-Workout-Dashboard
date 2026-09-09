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

export function WorkoutsTable() {
  const { data, isLoading, isError } = useWorkouts();

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  if (isLoading) {
    return <p className="text-gray-400">Loading…</p>;
  }
  if (isError) {
    return <p className="text-red-400">Error loading data</p>;
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="h-1 bg-linear-to-r from-emerald-400 via-cyan-400 to-indigo-500" />
        <div className="p-6 pb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Workouts
          </h2>
        </div>
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
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-start gap-2 border-t border-white/10 px-6 py-4">
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
    </div>
  );
}
