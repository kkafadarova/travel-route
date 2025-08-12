import type { Country, CountryDetails } from "../types";

const FIELDS = "cca3,name,flags";
const API = `https://restcountries.com/v3.1/all?fields=${FIELDS}`;

export async function fetchCountries(signal?: AbortSignal): Promise<Country[]> {
  const request = await fetch(API, { signal });
  if (!request.ok) {
    throw new Error(`Countries request failed: ${request.status} ${request.statusText}`);
  }

  const data = (await request.json()) as CountryDetails[];
  const countryList: Country[] = data.map((country) => ({
    cca3: country.cca3,
    name: country.name.common,
    flag: country.flags.png ?? country.flags.svg,
  }));

  countryList.sort((a, b) => a.name.localeCompare(b.name));
  return countryList;
}
