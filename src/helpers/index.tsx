import type { Edge } from "reactflow";
import rules from "../rules/blockedRoutes.json";
import type { BlockedRoutesConfig } from "../types";

export function createsCycle(
  edges: Edge[],
  source: string | null,
  target: string | null
): boolean {
  console.log(source);
  console.log(target);
  if (!source || !target) return false;

  const connections: Record<string, string[]> = {};
  console.log(edges);
  for (const e of edges) {
    if (!connections[e.source]) {
      connections[e.source] = [];
    }
    connections[e.source].push(e.target);
  }

  const visited = new Set<string>();

  function canReachSource(current: string): boolean {
    if (current === source) {
      return true;
    }

    if (visited.has(current)) {
      return false;
    }

    visited.add(current);

    const neighbors = connections[current] || [];

    for (const neighbor of neighbors) {
      if (canReachSource(neighbor)) {
        return true;
      }
    }

    return false;
  }

  return canReachSource(target);
}

export function isRouteBlocked(
  sourceId: string | null,
  targetId: string | null
): string | null {
  const config = rules as BlockedRoutesConfig;

  const oneWayMatch = config.blocked.find(
    (rule) => rule.from === sourceId && rule.to === targetId
  );
  if (oneWayMatch) {
    return oneWayMatch.reason ?? `${sourceId} → ${targetId} is blocked`;
  }

  if (config.blockedUndirected) {
    const twoWayMatch = config.blockedUndirected.some(
      ([a, b]) =>
        (a === sourceId && b === targetId) || (a === targetId && b === sourceId)
    );
    if (twoWayMatch) {
      return `${sourceId} ↔ ${targetId} is blocked`;
    }
  }

  return null;
}
