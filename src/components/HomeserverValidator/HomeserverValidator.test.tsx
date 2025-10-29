import { describe, it, expect, vi, afterEach, Mock } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import HomeserverValidator from "./HomeserverValidator";
import useHomeserverValidationStatus from "@/hooks/useHomeserverValidationStatus/useHomeserverValidationStatus";

afterEach(() => cleanup());

vi.mock("@/hooks/useHomeserverValidationStatus/useHomeserverValidationStatus");

describe("<HomeserverValidator />", () => {
  const mockHook = useHomeserverValidationStatus as Mock;
  const baseProps = {
    value: "",
    isLoading: false,
    isError: false,
    isValid: true,
    onChange: vi.fn(),
  };

  it("renders label and input", () => {
    mockHook.mockReturnValue({ statusText: null, statusClass: "" });
    render(<HomeserverValidator {...baseProps} />);
    expect(screen.getByLabelText(/Homeserver URL/i)).toBeDefined();
  });

  it("calls onChange when input changes", () => {
    mockHook.mockReturnValue({ statusText: null, statusClass: "" });
    const handleChange = vi.fn();
    render(<HomeserverValidator {...baseProps} onChange={handleChange} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "https://matrix.org" },
    });
    expect(handleChange).toHaveBeenCalledWith("https://matrix.org");
  });

  it("renders status text when hook provides it", () => {
    mockHook.mockReturnValue({
      statusText: "Homeserver looks good",
      statusClass: "text-green-500",
    });
    render(<HomeserverValidator {...baseProps} />);
    expect(screen.getByText("Homeserver looks good")).toBeDefined();
  });

  it("renders no status text when hook returns null", () => {
    mockHook.mockReturnValue({ statusText: null, statusClass: "" });
    render(<HomeserverValidator {...baseProps} />);
    expect(screen.queryByText("Homeserver looks good")).toBeNull();
  });
});
