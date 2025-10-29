import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";

import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders username and password inputs and signup link", () => {
    render(
      <LoginForm
        homeserver=""
        isHsValid={true}
        isHsLoading={false}
        isHsError={false}
        canSubmit={true}
      />
    );

    expect(screen.getByLabelText("Username")).toBeTruthy();
    expect(screen.getByLabelText("Password")).toBeTruthy();

    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/auth/register"
    );

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("disables submit button when canSubmit is false", () => {
    render(
      <LoginForm
        homeserver=""
        isHsValid={true}
        isHsLoading={false}
        isHsError={false}
        canSubmit={false}
      />
    );

    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
  });
});
