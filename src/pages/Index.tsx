import { useState, useRef } from "react";
import { InputForm } from "@/components/InputForm";
import { GraphVisualization } from "@/components/GraphVisualization";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExportOptions } from "@/components/ExportOptions";
import { findConnectedComponents, GraphData } from "@/lib/graphAlgorithms";
import { Network, Github, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [inputStats, setInputStats] = useState<{ n: number; edges: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleSvgRef = (ref: React.RefObject<SVGSVGElement>) => {
    (svgRef as any).current = ref.current;
  };

  const handleAnalyze = (n: number, edges: [number, number][]) => {
    const data = findConnectedComponents(n, edges);
    setGraphData(data);
    setInputStats({ n, edges: edges.length });
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-primary">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Group Chat Clusters</h1>
                <p className="text-sm text-muted-foreground">Connected Components Visualizer</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="#docs" className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Docs</span>
                </a>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8 px-4 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Discover Friend Group Clusters
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Analyze social connections using graph theory. Identify separate friend groups by finding
            connected components in an undirected graph using BFS algorithms.
          </p>
        </section>

        {/* Input Form */}
        <section className="max-w-2xl mx-auto animate-scale-in">
          <InputForm onAnalyze={handleAnalyze} />
        </section>

        {/* Results and Visualization */}
        {graphData && inputStats && (
          <>
            <section className="space-y-6">
              <ResultsDisplay
                components={graphData.components}
                totalStudents={inputStats.n}
                totalConnections={inputStats.edges}
                componentDetails={graphData.componentDetails}
              />
              
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-slide-up">
                <div className="mb-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                        Interactive Graph Visualization
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Each color represents a separate friend group. Drag nodes, scroll to zoom, hover to highlight.
                      </p>
                    </div>
                    <ExportOptions graphData={graphData} svgRef={svgRef} />
                  </div>
                </div>
                <GraphVisualization data={graphData} onSvgRef={handleSvgRef} />
              </div>
            </section>
          </>
        )}

        {/* Algorithm Explanation */}
        <section id="docs" className="max-w-4xl mx-auto space-y-6 py-8">
          <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-4">How It Works</h3>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">1. Graph Construction</h4>
                <p>Students are represented as nodes, and direct messages create undirected edges between them.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">2. BFS Algorithm</h4>
                <p>
                  Breadth-First Search explores the graph starting from unvisited nodes, 
                  marking all reachable nodes as part of the same connected component.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">3. Component Counting</h4>
                <p>
                  Each BFS traversal identifies one friend group. The total number of traversals 
                  needed equals the number of separate friend groups.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">4. Visualization</h4>
                <p>
                  D3.js force-directed graph layout positions nodes and edges dynamically, 
                  with each component colored uniquely for clarity.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-4">Complexity Analysis</h3>
            <div className="space-y-2 text-muted-foreground font-mono text-sm">
              <p><span className="text-foreground font-semibold">Time Complexity:</span> O(n + m) where n = students, m = connections</p>
              <p><span className="text-foreground font-semibold">Space Complexity:</span> O(n + m) for adjacency list and visited array</p>
              <p><span className="text-foreground font-semibold">Algorithm:</span> Breadth-First Search (BFS)</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Built with React, TypeScript, D3.js, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
