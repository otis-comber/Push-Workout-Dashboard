import { waitFor } from "@testing-library/react";
import { buildWorkout } from "@/testing/fixtures/workouts";
import {
  errorWorkoutsHandler,
  workoutsHandler,
} from "@/testing/handlers/workouts";
import { setupServer } from "@/testing/msw";
import { renderHook } from "@/testing/renderHook";
import { useWorkouts } from "./index";

const server = setupServer();

describe("useWorkouts", () => {
  it("returns workouts once the request resolves", async () => {
    server.use(workoutsHandler([buildWorkout({ pushId: "w1" })]));

    const { result } = renderHook(() => useWorkouts());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].pushId).toBe("w1");
  });

  it("surfaces an error when the request fails", async () => {
    server.use(errorWorkoutsHandler(500));

    const { result } = renderHook(() => useWorkouts());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
