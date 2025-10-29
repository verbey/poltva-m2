import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, renderHook, act, screen } from "@testing-library/react";
import useAuthCard from "@/hooks/useAuthCard/useAuthCard";
import * as validator from "@/lib/matrix/validateHomeserver";
import { useDebouncedValue } from "@/hooks/useAuthCard/useAuthCard";

vi.mock("@/lib/matrix/validateHomeserver");

describe("useAuthCard (hook)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("resets state when input cleared", async () => {
    const mockValidate = vi.mocked(validator.default);
    mockValidate.mockResolvedValueOnce(true);

    const { result } = renderHook(() => useAuthCard());

    act(() => {
      result.current.setHomeserver("https://example.com");
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });

    expect(result.current.isHsLoading).toBe(false);
    expect(result.current.isHsValid).toBe(true);

    act(() => {
      result.current.setHomeserver("");
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });

    expect(result.current.isHsLoading).toBe(false);
    expect(result.current.isHsError).toBe(false);
    expect(result.current.isHsValid).toBe(null);
    expect(result.current.hsErrorMessage).toBe(null);
  });

  it("cancels earlier validation results when input changes", async () => {
    const mockValidate = vi.mocked(validator.default);
    let resolveFirst: (v: boolean) => void;
    const firstPromise = new Promise<boolean>((res) => {
      resolveFirst = res;
    });
    mockValidate.mockReturnValueOnce(firstPromise as Promise<boolean>);

    const { result } = renderHook(() => useAuthCard());

    act(() => {
      result.current.setHomeserver("first");
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });

    const secondPromise = Promise.resolve(true);
    mockValidate.mockReturnValueOnce(secondPromise);
    act(() => {
      result.current.setHomeserver("second");
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });

    act(() => {
      resolveFirst!(false);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isHsValid).toBe(true);
    expect(result.current.isHsError).toBe(false);
  });
});

function Probe({ value, delay = 50 }: { value: string; delay?: number }) {
  const debounced = useDebouncedValue(value, delay);
  return <div data-testid="debounced">{debounced}</div>;
}

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates only after delay", async () => {
    const { rerender } = render(<Probe value="" delay={100} />);
    expect(screen.getByTestId("debounced").textContent).toBe("");

    rerender(<Probe value="a" delay={100} />);
    expect(screen.getByTestId("debounced").textContent).toBe("");
    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(screen.getByTestId("debounced").textContent).toBe("");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId("debounced").textContent).toBe("a");
  });
});
