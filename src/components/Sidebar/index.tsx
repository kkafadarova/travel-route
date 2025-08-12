import styles from "./Sidebar.module.scss";
import { useCountries } from "../../hooks/useCountries";
import type { SidebarProps } from "../../types";

const Sidebar: React.FC<SidebarProps> = ({
  onAdd,
  onDelete,
  addedCountries,
}) => {
  const { filteredCountries, search, setSearch, loading, error } =
    useCountries();

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
        className={styles.search}
      />

      {loading && <p>Loading countries...</p>}
      {error && (
        <p style={{ color: "red" }}>
          Error loading countries{error ? `: ${error}` : ""}
        </p>
      )}

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
