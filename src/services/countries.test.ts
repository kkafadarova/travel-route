import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchCountries } from "./countries";
import type { CountryDetails } from "../types";

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetchOk(payload: unknown) {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => payload,
  } as unknown as Response);
}

function mockFetchFail(status = 500, statusText = "Server Error") {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: false,
    status,
    statusText,
    json: async () => ({}),
  } as unknown as Response);
}

describe("fetchCountries", () => {
  it("maps and sorts countries (prefers png, falls back to svg)", async () => {
const apiData: CountryDetails[] = [
  {
    cca3: "GRC",
    name: { common: "Greece" },               
    flags: { svg: "greece.svg" },             
  },
  {
    cca3: "ESP",
    name: { common: "Spain" },
    flags: { png: "spain.png", svg: "spain.svg" },
  },
  {
    cca3: "FRA",
    name: { common: "France" },
    flags: { png: "france.png", svg: "france.svg" },
  },
];

    mockFetchOk(apiData);

    const result = await fetchCountries();

    expect(result.map((c) => c.cca3)).toEqual(["FRA", "GRC", "ESP"]);

    expect(result.find((c) => c.cca3 === "ESP")!.flag).toBe("spain.png");
    expect(result.find((c) => c.cca3 === "GRC")!.flag).toBe("greece.svg");
  });

  it("calls fetch with the expected URL (no options)", async () => {
    const apiData: CountryDetails[] = [];
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => apiData,
      } as unknown as Response);

    await fetchCountries();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0];
    expect(typeof url).toBe("string");
    expect(options).toBeUndefined();
  });

  it("throws with status and statusText when response not ok", async () => {
    mockFetchFail(404, "Not Found");

    await expect(fetchCountries()).rejects.toThrow(
      "Countries request failed: 404 Not Found"
    );
  });
});
