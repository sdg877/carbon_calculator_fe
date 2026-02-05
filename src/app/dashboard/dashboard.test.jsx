/** @vitest-environment jsdom */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi, beforeEach } from "vitest";
import DashboardPage from "./page";

vi.mock("next/link", () => ({
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

beforeEach(() => {
  global.localStorage = {
    getItem: vi.fn().mockReturnValue(null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    }),
  );
});

test("Renders the dashboard title", async () => {
  render(<DashboardPage />);

  await waitFor(() => {
    const title = screen.getByText(/My Carbon Dashboard/i);
    expect(title).toBeDefined();
  });
});
