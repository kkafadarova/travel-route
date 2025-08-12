import type { Edge, Node } from "reactflow";

type OneWayBlockRule = {
  from: string;
  to: string;
  reason?: string;
};

export type BlockedRoutesConfig = {
  blocked: OneWayBlockRule[];
  blockedUndirected?: [string, string][];
};

export type CountryData = {
  name: string;
  flag?: string;
  onDelete?: (id: string) => void;
};

export type ButtonProps = {
  nodes: Node[];
  edges: Edge[];
};

export type Country = { cca3: string; name: string; flag?: string };
export type SidebarProps = {
  onAdd: (country: Country) => void;
  onDelete: (id: string) => void;
  addedCountries: string[];
};
export type CountryDetails = {
  cca3: string;
  name: { common: string };
  flags: { png?: string; svg?: string };
};
