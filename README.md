# Travel Route Builder

A React + TypeScript web application for designing and visualizing travel routes between countries, powered by **React Flow** and **REST Countries API**.

---

## Features

- **Add countries as nodes**  
  Search for a country and add it to the graph with a single click.

- **Interactive graph**  
  Drag and connect countries to define a travel route.

- **Country nodes**  
  Each node displays the country name and flag.

- **Connections & rules**

  - Prevent self-loops and duplicate edges.
  - Prevent cycles (no infinite loops).
  - Block specific routes based on predefined rules from a JSON config.

- **Export**  
  Download the current route as a JSON file.

- **Branching**  
  Create multiple paths from the same country.

---

## Tech Stack

- **React** (with TypeScript)
- **React Flow**
- **SCSS Modules** for styling
- **REST Countries API** for live country data
- **Vitest + React Testing Library** for unit testing

---

## Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the app**

   ```bash
   npm run dev
   ```

3. **Run tests**
   ```bash
   npm run test
   ```

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar/         # Country search + add panel
│   ├── TravelRoute/     # Main graph view
│   ├── CountryNode/     # Custom node UI
│   ├── ExportButton/    # JSON export button
│
├── helpers/
│   ├── createsCycle.ts  # Cycle detection logic
│   ├── isRouteBlocked.ts# Block rules logic
│
├── rules/
│   └── blockedRoutes.json
│
├── types/               # TypeScript type definitions
```

---

## Blocking Rules

You can define blocked routes in `src/rules/blockedRoutes.json`:

```json
{
  "blocked": [
    {
      "from": "ESP",
      "to": "GRC",
      "reason": "Direct travel from Spain to Greece is blocked"
    }
  ],
  "blockedUndirected": [["USA", "CAN"]]
}
```

---

## Usage

1. Start the app.
2. Search for a country in the **Sidebar**.
3. Click **Add** to add it to the graph.
4. Connect countries by dragging edges between them.
5. Use the **Export JSON** button to download your route.
6. Delete an already added country by clicking the x on the right.
