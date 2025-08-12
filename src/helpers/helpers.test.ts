import { describe, it, expect, vi } from 'vitest';
import type { Edge } from 'reactflow';

vi.mock('../rules/blockedRoutes.json', () => ({
  default: {
    blocked: [
      { from: 'ESP', to: 'GRC', reason: 'Spain → Greece is blocked' },
      { from: 'USA', to: 'CUB' },
    ],
    blockedUndirected: [
      ['ARM', 'AZE'],
    ],
  },
}));

import { createsCycle, isRouteBlocked } from './';

describe('createsCycle', () => {
  it('returns false when there are no edges', () => {
    const edges: Edge[] = [];
    expect(createsCycle(edges, 'A', 'B')).toBe(false);
  });

  it('returns false when adding edge does not create a cycle', () => {
    const edges: Edge[] = [
      { id: 'A-B', source: 'A', target: 'B' },
      { id: 'B-C', source: 'B', target: 'C' },
    ] as Edge[];

    expect(createsCycle(edges, 'C', 'D')).toBe(false);
  });

  it('returns true when adding edge would close a cycle', () => {
    const edges: Edge[] = [
      { id: 'A-B', source: 'A', target: 'B' },
      { id: 'B-C', source: 'B', target: 'C' },
    ] as Edge[];

    expect(createsCycle(edges, 'C', 'A')).toBe(true);
  });

  it('returns true for a self-loop (source === target)', () => {
    const edges: Edge[] = [];
    expect(createsCycle(edges, 'X', 'X')).toBe(true);
  });

  it('handles null source/target safely (returns false)', () => {
    const edges: Edge[] = [{ id: 'A-B', source: 'A', target: 'B' }] as Edge[];
    expect(createsCycle(edges, null, 'A')).toBe(false);
    expect(createsCycle(edges, 'A', null)).toBe(false);
  });
});

describe('isRouteBlocked', () => {
  it('blocks one-way routes from JSON', () => {
    expect(isRouteBlocked('ESP', 'GRC')).toMatch(/blocked/i);
    expect(isRouteBlocked('USA', 'CUB')).toMatch(/blocked/i);
  });

  it('does not block the reverse of a one-way rule', () => {
    expect(isRouteBlocked('GRC', 'ESP')).toBeNull();
  });

  it('blocks undirected pairs both ways', () => {
    expect(isRouteBlocked('ARM', 'AZE')).toMatch(/blocked/i);
    expect(isRouteBlocked('AZE', 'ARM')).toMatch(/blocked/i);
  });

  it('returns null when route is not blocked', () => {
    expect(isRouteBlocked('FRA', 'DEU')).toBeNull();
  });

  it('handles null ids', () => {
    expect(isRouteBlocked(null, 'ESP')).toBeNull();
    expect(isRouteBlocked('ESP', null)).toBeNull();
  });
});
