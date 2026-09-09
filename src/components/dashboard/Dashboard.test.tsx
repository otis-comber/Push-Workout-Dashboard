import { screen } from "@testing-library/react";
import { useWorkouts } from "@/lib/workouts";
import { render } from "@/testing/render";
import { Dashboard } from "./Dashboard";

vi.mock("@/lib/workouts", async (importActual) => ({
  ...(await importActual<typeof import("@/lib/workouts")>()),
  useWorkouts: vi.fn(),
}));

vi.mock("@/components/charts/LiftProgressChart", () => ({
  LiftProgressChart: () => <div>lift progress chart</div>,
}));
vi.mock("@/components/charts/WorkoutFrequencyChart", () => ({
  WorkoutFrequencyChart: () => <div>workout frequency chart</div>,
}));
vi.mock("@/components/tables/PersonalBestsTable", () => ({
  PersonalBestsTable: () => <div>personal bests table</div>,
}));
vi.mock("@/components/tables/WorkoutsTable", () => ({
  WorkoutsTable: () => <div>workouts table</div>,
}));

const mockUseWorkouts = vi.mocked(useWorkouts);

describe("Dashboard", () => {
  it("shows one loading state and no widgets while data is loading", () => {
    mockUseWorkouts.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useWorkouts>);

    render(<Dashboard />);

    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.queryByText("workouts table")).not.toBeInTheDocument();
  });

  it("shows one error state and no widgets on failure", () => {
    mockUseWorkouts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useWorkouts>);

    render(<Dashboard />);

    expect(screen.getByText("Error loading data")).toBeInTheDocument();
    expect(screen.queryByText("workouts table")).not.toBeInTheDocument();
  });

  it("renders all widgets once loaded", () => {
    mockUseWorkouts.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useWorkouts>);

    render(<Dashboard />);

    expect(screen.getByText("workouts table")).toBeInTheDocument();
    expect(screen.getByText("personal bests table")).toBeInTheDocument();
    expect(screen.getByText("lift progress chart")).toBeInTheDocument();
    expect(screen.getByText("workout frequency chart")).toBeInTheDocument();
  });
});
