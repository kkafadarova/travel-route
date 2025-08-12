import { useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";
import type { Country, CountryDetails, SidebarProps } from "../../types";

const Sidebar: React.FC<SidebarProps> = ({
  onAdd,
  onDelete,
  addedCountries,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=cca3,name,flags")
      .then((res) => res.json())
      .then((data) => {
        const countryList = data.map((c: CountryDetails) => ({
          cca3: c.cca3,
          name: c.name.common,
          flag: c.flags.png,
        }));
        countryList.sort((a: Country, b: Country) =>
          a.name.localeCompare(b.name)
        );
        setCountries(countryList);
      });
  }, []);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cca3.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside
      style={{
        width: 250,
        borderRight: "1px solid #ccc",
        padding: 10,
        overflow: "auto",
      }}
    >
      <h3>Countries</h3>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        style={{ width: "100%", marginBottom: 10 }}
      />

      {filteredCountries.map((country) => {
        const isAdded = addedCountries.includes(country.cca3);
        return (
          <div key={country.cca3} className={styles.item}>
            <div className={styles.itemLeft}>
              {country.flag && (
                <img
                  src={country.flag}
                  alt={`${country.name} flag`}
                  width={20}
                />
              )}
              <span>
                {country.name} ({country.cca3})
              </span>
            </div>
            {isAdded ? (
              <button
                className={styles.deleteBtn}
                onClick={() => onDelete(country.cca3)}
              >
                Delete
              </button>
            ) : (
              <button className={styles.addBtn} onClick={() => onAdd(country)}>
                Add
              </button>
            )}
          </div>
        );
      })}
    </aside>
  );
};
export default Sidebar;
