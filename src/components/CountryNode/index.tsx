import React from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import type { CountryData } from "../../types";
import styles from "./CountryNode.module.scss";

const CountryNode: React.FC<NodeProps<CountryData>> = ({
  id,
  data,
  selected,
}) => {
  return (
    <div className={`${styles.node} ${selected ? styles.selected : ""}`}>
      {data.flag && (
        <img
          src={data.flag}
          alt={`${data.name} flag`}
          width={24}
          height={16}
          className={styles.flag}
        />
      )}
      <span>{data.name}</span>
      <button
        style={{
          marginLeft: "auto",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "red",
          fontWeight: "bold",
        }}
        onClick={() => data.onDelete?.(id)}
        title="Remove country"
      >
        ✕
      </button>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CountryNode;
