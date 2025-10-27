import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordInput from "../../components/PasswordInput";

afterEach(() => cleanup());

describe("PasswordInput", () => {
  beforeEach(() => {
    render(<PasswordInput placeholder="Password" className="custom" />);
  });

  it("renders an input of type password by default", () => {
    const input = screen.getByPlaceholderText("Password") as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe("password");
  });

  it("toggles input type and button aria-label when clicked", async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("Password") as HTMLInputElement;
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    expect(input.type).toBe("password");
    expect(toggleButton).toBeTruthy();
    expect(toggleButton.getAttribute("aria-label")?.toLowerCase()).toContain(
      "show password"
    );

    await user.click(toggleButton);
    expect(input.type).toBe("text");
    expect(toggleButton.getAttribute("aria-label")?.toLowerCase()).toContain(
      "hide password"
    );

    await user.click(toggleButton);
    expect(input.type).toBe("password");
    expect(toggleButton.getAttribute("aria-label")?.toLowerCase()).toContain(
      "show password"
    );
  });

  it("merges provided className with internal classes on the input", () => {
    const input = screen.getByPlaceholderText("Password") as HTMLInputElement;
    const classAttr = input.getAttribute("class") || "";
    expect(classAttr).toContain("pr-10");
    expect(classAttr).toContain("custom");
  });

  it("renders a toggle button that is not tabbable (tabIndex -1)", () => {
    const toggleButton = screen.getByRole("button", { name: /show password/i });
    expect(toggleButton.getAttribute("tabindex")).toBe("-1");
  });
});
