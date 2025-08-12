import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Sidebar from "./";
import type { Country } from "../../types";
import { vi } from "vitest";

const mockCountries: Country[] = [
  { cca3: "ESP", name: "Spain", flag: "spain.png" },
  { cca3: "GRC", name: "Greece", flag: "greece.png" },
];

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve(
        mockCountries.map((country) => ({
          cca3: country.cca3,
          name: { common: country.name },
          flags: { png: country.flag },
        }))
      ),
  })
) as unknown as typeof fetch;

describe("Sidebar", () => {
  it("renders countries after fetch", async () => {
    const handleAdd = vi.fn();
    render(<Sidebar onAdd={handleAdd} addedCountries={[]} />);

    expect(screen.queryByText(/Spain/)).toBeNull();

    await waitFor(() => {
      expect(screen.getByText(/Spain/)).toBeInTheDocument();
      expect(screen.getByText(/Greece/)).toBeInTheDocument();
    });
  });

  it("filters countries based on search input", async () => {
    const handleAdd = vi.fn();
    render(<Sidebar onAdd={handleAdd} addedCountries={[]} />);

    await waitFor(() => screen.getByText(/Spain/));

    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: "Spain" } });

    expect(screen.getByText(/Spain/)).toBeInTheDocument();
    expect(screen.queryByText(/Greece/)).toBeNull();
  });

  it("calls onAdd when Add button is clicked", async () => {
    const handleAdd = vi.fn();
    render(<Sidebar onAdd={handleAdd} addedCountries={[]} />);

    await waitFor(() => screen.getByText(/Spain/i));

    fireEvent.change(screen.getByPlaceholderText(/Search/i), {
      target: { value: "spain" },
    });

    const addButton = screen.getByRole("button", { name: /add/i });
    fireEvent.click(addButton);

    expect(handleAdd).toHaveBeenCalledWith({
      cca3: "ESP",
      name: "Spain",
      flag: "spain.png",
    });
  });

  it("shows Delete button if country is already added", async () => {
    const handleAdd = vi.fn();
    render(
      <Sidebar onAdd={handleAdd} addedCountries={[mockCountries[0].cca3]} />
    );

    await waitFor(() => screen.getByText(/Spain/));

    const deleteButton = screen.getByText(/Delete/i);
    expect(deleteButton).toBeInTheDocument();
  });
});
