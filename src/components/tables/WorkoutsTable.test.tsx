import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useWorkouts } from "@/lib/workouts";
import { buildWorkout } from "@/testing/fixtures/workouts";
import { render } from "@/testing/render";
import { WorkoutsTable } from "./WorkoutsTable";

vi.mock("@/lib/workouts", async (importActual) => ({
  ...(await importActual<typeof import("@/lib/workouts")>()),
  useWorkouts: vi.fn(),
}));

const mockUseWorkouts = vi.mocked(useWorkouts);

function buildWorkoutsPage(count: number) {
  return Array.from({ length: count }, (_, i) =>
    buildWorkout({
      pushId: `w${i}`,
      name: `Workout ${i}`,
      startTime: new Date(2026, 4, i + 1),
    }),
  );
}

describe("WorkoutsTable", () => {
  it("shows the first page and paginates on Next", async () => {
    mockUseWorkouts.mockReturnValue({
      data: buildWorkoutsPage(7),
    } as unknown as ReturnType<typeof useWorkouts>);

    render(<WorkoutsTable />);

    expect(screen.getByText("Workout 0")).toBeInTheDocument();
    expect(screen.queryByText("Workout 5")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Workout 5")).toBeInTheDocument();
  });

  it("disables Previous on the first page", () => {
    mockUseWorkouts.mockReturnValue({
      data: buildWorkoutsPage(2),
    } as unknown as ReturnType<typeof useWorkouts>);

    render(<WorkoutsTable />);

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });
});
