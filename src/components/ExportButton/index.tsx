import React, { useCallback } from "react";
import styles from "./ExportButton.module.scss";
import type { ButtonProps } from "../../types";

const ExportButton: React.FC<ButtonProps> = ({ nodes, edges }) => {
  const exportRoute = useCallback(() => {
    const payload = {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: e.type,
      })),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "travel-route.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  return (
    <div style={{ position: "absolute", right: 12, top: 12, zIndex: 5 }}>
      <button
        onClick={exportRoute}
        className={styles.button}
        title="Export route as JSON"
      >
        Export JSON
      </button>
    </div>
  );
};

export default ExportButton;
