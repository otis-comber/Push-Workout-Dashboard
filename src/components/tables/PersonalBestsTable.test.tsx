import { screen } from "@testing-library/react";
import { usePersonalBests } from "@/hooks/usePersonalBests";
import { render } from "@/testing/render";
import { PersonalBestsTable } from "./PersonalBestsTable";

vi.mock("@/hooks/usePersonalBests", () => ({
  usePersonalBests: vi.fn(),
}));

const mockUsePersonalBests = vi.mocked(usePersonalBests);

describe("PersonalBestsTable", () => {
  it("renders nothing while personal bests haven't loaded", () => {
    mockUsePersonalBests.mockReturnValue({
      personalBests: undefined,
    } as unknown as ReturnType<typeof usePersonalBests>);

    const { container } = render(<PersonalBestsTable />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a row per personal best", () => {
    mockUsePersonalBests.mockReturnValue({
      personalBests: [
        {
          exercise: "Barbell Bench Press",
          oneRepMax: 110,
          weight: 85,
          reps: 5,
          date: new Date("2026-05-01"),
        },
      ],
    } as unknown as ReturnType<typeof usePersonalBests>);

    render(<PersonalBestsTable />);

    expect(screen.getByText("Barbell Bench Press")).toBeInTheDocument();

    expect(screen.getByText("110.0 kg")).toBeInTheDocument();
    expect(screen.getByText("85kg × 5")).toBeInTheDocument();
  });
});
