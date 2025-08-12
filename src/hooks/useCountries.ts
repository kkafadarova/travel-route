import { useEffect, useState } from "react";
import type { Country } from "../types";
import { fetchCountries } from "../services/countries";

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchCountries()
      .then(setCountries)
      .catch((err) =>
        setError(err instanceof Error ? err.message : String(err))
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cca3.toLowerCase().includes(search.toLowerCase())
  );

  return { countries, filteredCountries, search, setSearch, loading, error };
}
