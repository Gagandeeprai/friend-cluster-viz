export interface GraphNode {
  id: number;
  group: number;
}

export interface GraphLink {
  source: number;
  target: number;
}

export interface ComponentDetail {
  id: number;
  size: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  components: number;
  componentDetails: ComponentDetail[];
}

export function findConnectedComponents(n: number, edges: [number, number][]): GraphData {
  // Build adjacency list
  const graph: { [key: number]: number[] } = {};
  for (let i = 1; i <= n; i++) {
    graph[i] = [];
  }
  
  edges.forEach(([u, v]) => {
    graph[u].push(v);
    graph[v].push(u);
  });

  // BFS to find connected components
  const visited = new Array(n + 1).fill(false);
  let components = 0;
  const nodeToGroup: { [key: number]: number } = {};
  const componentSizes: { [key: number]: number } = {};

  function bfs(start: number, group: number): number {
    const queue = [start];
    visited[start] = true;
    nodeToGroup[start] = group;
    let size = 1;

    while (queue.length) {
      const node = queue.shift()!;
      for (const neighbor of graph[node]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          nodeToGroup[neighbor] = group;
          queue.push(neighbor);
          size++;
        }
      }
    }
    return size;
  }

  // Find all connected components
  for (let i = 1; i <= n; i++) {
    if (!visited[i]) {
      components++;
      const size = bfs(i, components);
      componentSizes[components] = size;
    }
  }

  // Build nodes and links for visualization
  const nodes: GraphNode[] = Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    group: nodeToGroup[i + 1] || components + 1,
  }));

  const links: GraphLink[] = edges.map(([u, v]) => ({
    source: u,
    target: v
  }));

  const componentDetails: ComponentDetail[] = Object.entries(componentSizes)
    .map(([id, size]) => ({ id: parseInt(id), size }))
    .sort((a, b) => b.size - a.size);

  return { nodes, links, components, componentDetails };
}
