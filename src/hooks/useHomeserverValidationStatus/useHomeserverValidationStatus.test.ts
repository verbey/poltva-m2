import { describe, it, expect, vi } from "vitest";
import useHomeserverValidationStatus from "./useHomeserverValidationStatus";

describe("useHomeserverValidationStatus", () => {
  const baseProps = {
    value: "",
    isLoading: false,
    isError: false,
    isValid: null,
    errorMessage: null,
    onChange: vi.fn(),
  };

  it("returns default muted status when value is empty", () => {
    const { statusText, statusClass } =
      useHomeserverValidationStatus(baseProps);
    expect(statusText).toBeNull();
    expect(statusClass).toBe("text-muted-foreground");
  });

  it("returns 'Validating homeserver…' when loading", () => {
    const { statusText } = useHomeserverValidationStatus({
      ...baseProps,
      value: "https://matrix.org",
      isLoading: true,
    });
    expect(statusText).toBe("Validating homeserver…");
  });

  it("returns error message and destructive color when invalid", () => {
    const { statusText, statusClass } = useHomeserverValidationStatus({
      ...baseProps,
      value: "https://matrix.org",
      isError: true,
      errorMessage: "Bad domain",
    });
    expect(statusText).toBe("Bad domain");
    expect(statusClass).toBe("text-destructive");
  });

  it("returns success text when valid", () => {
    const { statusText, statusClass } = useHomeserverValidationStatus({
      ...baseProps,
      value: "https://matrix.org",
      isValid: true,
    });
    expect(statusText).toBe("Homeserver looks good");
    expect(statusClass).toContain("text-green");
  });
});
