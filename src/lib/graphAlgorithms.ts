export interface GraphNode {
  id: number;
  group: number;
}

export interface GraphLink {
  source: number;
  target: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  components: number;
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

  function bfs(start: number, group: number) {
    const queue = [start];
    visited[start] = true;
    nodeToGroup[start] = group;

    while (queue.length) {
      const node = queue.shift()!;
      for (const neighbor of graph[node]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          nodeToGroup[neighbor] = group;
          queue.push(neighbor);
        }
      }
    }
  }

  // Find all connected components
  for (let i = 1; i <= n; i++) {
    if (!visited[i]) {
      components++;
      bfs(i, components);
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

  return { nodes, links, components };
}
