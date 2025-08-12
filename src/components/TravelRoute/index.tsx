import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
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
   * валидиране на връзките (без alert тук)
   * връща true/false и записва причина в invalidReason
   */
  const isValidConnection = useCallback(
    (connection: Connection) => {
      const { source, target } = connection;
      if (!source || !target) return false;

      /**
       * block already existed connection
       */
      const alreadyExistedEdge = edges.some(
        (edge) => edge.source === source && edge.target === target
      );
      if (alreadyExistedEdge) {
        setInvalidReason(null);
        return false;
      }

      /**
       * block self-loop
       */
      if (source === target) {
        setInvalidReason("A country cannot connect to itself.");
        return false;
      }

      /**
       *  block specific routes based on predefined rules stored in JSON
       */
      const reason = isRouteBlocked(source, target);
      if (reason) {
        setInvalidReason(reason);
        return false;
      }

      /**
       * cycle prevention validation
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
   * показваме alert само веднъж, когато жестът за свързване приключи
   */
  const onConnectEnd = useCallback(() => {
    if (invalidReason) {
      alert(invalidReason);
      setInvalidReason(null);
    }
  }, [invalidReason]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      setEdges((edges) => addEdge({ ...connection }, edges));
    },
    [setEdges]
  );

  const addCountryNode = useCallback(
    (country: Country) => {
      setNodes((nodes) => {
        if (nodes.some((node) => node.id === country.cca3)) {
          return nodes;
        }
        /**
         * create a random position where to put the node
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
         * automatically centers and scales the view when no nodes or when loaded an empty graph
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
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default TravelRoute;
