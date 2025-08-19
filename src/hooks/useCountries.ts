import { useEffect, useState, useMemo } from "react";
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

  const filteredCountries = useMemo(() => {
  const searchedWord = search.toLowerCase();
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchedWord) ||
      c.cca3.toLowerCase().includes(searchedWord)
  );
}, [countries, search]);

  return { countries, filteredCountries, search, setSearch, loading, error };
}
