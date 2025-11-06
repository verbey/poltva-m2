import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next/navigation", () => {
  const push = vi.fn();

  return {
    useRouter: () => ({
      push,
      pathname: "/",
      query: {},
    }),
  };
});
