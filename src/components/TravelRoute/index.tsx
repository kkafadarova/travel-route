import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import type { Connection, Edge, Node, ReactFlowInstance } from "reactflow";
import "reactflow/dist/style.css";
import CountryNode from "../CountryNode";
import { createsCycle, isRouteBlocked } from "../../helpers";

import Sidebar from "../Sidebar";
import styles from "./TravelRoute.module.scss";
import ExportButton from "../ExportButton";
import type { Country } from "../../types";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];
const nodeTypes = { country: CountryNode };

const TravelRoute: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const ref = useRef<ReactFlowInstance | null>(null);

  const [invalidReason, setInvalidReason] = useState<string | null>(null);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    ref.current = instance;
  }, []);

  /**
   * Validate connections (no alerts here)
   * Returns true/false and sets the reason in invalidReason
   */
  const isValidConnection = useCallback(
    (connection: Connection) => {
      const { source, target } = connection;
      if (!source || !target) return false;

      /**
       * Block already existing connection
       */
      const existsDirected = edges.some(
        (e) => e.source === source && e.target === target
      ); // A→B
      const existsReverse = edges.some(
        (e) => e.source === target && e.target === source
      ); // B→A

      if (existsDirected || existsReverse) {
        setInvalidReason(null);
        return false;
      }

      /**
       * Block self-loops
       */
      if (source === target) {
        setInvalidReason("A country cannot connect to itself.");
        return false;
      }

      /**
       * Block specific routes based on predefined rules stored in JSON
       */
      const reason = isRouteBlocked(source, target);
      if (reason) {
        setInvalidReason(reason);
        return false;
      }

      /**
       * Prevent cycles
       */
      if (createsCycle(edges, source, target)) {
        setInvalidReason(
          "This connection would create a loop. Cycles are not allowed."
        );
        return false;
      }

      setInvalidReason(null);
      return true;
    },
    [edges]
  );

  /**
   * Show alert only once when the connection gesture ends
   */
  const onConnectEnd = useCallback(() => {
    if (invalidReason) {
      alert(invalidReason);
      setInvalidReason(null);
    }
  }, [invalidReason]);

  /**
   * Add edge when a valid connection is made
   */
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      setEdges((edges) => addEdge({ ...connection }, edges));
    },
    [setEdges]
  );

  /**
   * Add a new country node
   */
  const addCountryNode = useCallback(
    (country: Country) => {
      setNodes((nodes) => {
        if (nodes.some((node) => node.id === country.cca3)) {
          return nodes;
        }
        /**
         * Create a random position for the node
         */
        const position = {
          x: 120 + Math.random() * 200,
          y: 120 + Math.random() * 160,
        };

        const updatedNodes = [
          ...nodes,
          {
            id: country.cca3,
            position,
            type: "country",
            data: {
              name: country.name,
              flag: country.flag,
              onDelete: (id: string) =>
                setNodes((nodes) => nodes.filter((n) => n.id !== id)),
            },
          },
        ];
        /**
         * Automatically center and scale the view
         * when no nodes exist or when loading an empty graph
         */
        if (nodes.length === 0) {
          setTimeout(() => ref.current?.fitView({ padding: 0.2 }), 0);
        }
        setInvalidReason(null);
        return updatedNodes;
      });
    },
    [setNodes]
  );

  /**
   * Remove a country node
   */
  const removeCountryNode = useCallback(
    (id: string) => {
      setNodes((nodes) => nodes.filter((n) => n.id !== id));
      setInvalidReason(null);
    },
    [setNodes]
  );

  return (
    <div className={styles.app}>
      <Sidebar
        onAdd={addCountryNode}
        onDelete={removeCountryNode}
        addedCountries={nodes.map((n) => n.id)}
      />
      <div className={styles.reactFlowWrapper}>
        <ExportButton nodes={nodes} edges={edges} />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={onInit}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
          onConnectEnd={onConnectEnd}
          fitView
        >
          <MiniMap nodeStrokeWidth={3} />
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default TravelRoute;
