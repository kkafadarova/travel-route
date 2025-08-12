import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useCountries } from "./useCountries";
import type { Country } from "../types";

vi.mock("../services/countries", () => ({
  fetchCountries: vi.fn(),
}));

import { fetchCountries } from "../services/countries";

const mockList: Country[] = [
  { cca3: "ESP", name: "Spain", flag: "spain.png" },
  { cca3: "GRC", name: "Greece", flag: "greece.png" },
  { cca3: "FRA", name: "France", flag: "france.png" },
];

describe("useCountries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts loading, then sets countries on success", async () => {
    (fetchCountries as unknown as vi.Mock).mockResolvedValueOnce(mockList);

    const { result } = renderHook(() => useCountries());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.countries).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.countries).toEqual(mockList);
    expect(result.current.filteredCountries).toEqual(mockList);
  });

  it("filters by name and code (cca3)", async () => {
    (fetchCountries as unknown as vi.Mock).mockResolvedValueOnce(mockList);

    const { result } = renderHook(() => useCountries());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.setSearch("spa"));
    expect(result.current.filteredCountries.map(c => c.cca3)).toEqual(["ESP"]);

    act(() => result.current.setSearch("grc"));
    expect(result.current.filteredCountries.map(c => c.cca3)).toEqual(["GRC"]);

    act(() => result.current.setSearch(""));
    expect(result.current.filteredCountries).toEqual(mockList);
  });

  it("sets error on failure", async () => {
    (fetchCountries as unknown as vi.Mock).mockRejectedValueOnce(
      new Error("boom")
    );

    const { result } = renderHook(() => useCountries());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toContain("boom");
    expect(result.current.countries).toEqual([]);
    expect(result.current.filteredCountries).toEqual([]);
  });
});
