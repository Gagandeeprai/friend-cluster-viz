import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { GraphData } from "@/lib/graphAlgorithms";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Pause } from "lucide-react";

interface AnimatedGraphVisualizationProps {
  data: GraphData;
}

export const AnimatedGraphVisualization = ({ data }: AnimatedGraphVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const animationRef = useRef<any>(null);

  const startAnimation = () => {
    setIsAnimating(true);
    setIsPaused(false);
    setCurrentStep(0);
  };

  const pauseAnimation = () => {
    setIsPaused(!isPaused);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const colors = [
      "hsl(188, 95%, 42%)",
      "hsl(265, 85%, 65%)", 
      "hsl(350, 85%, 60%)",
      "hsl(45, 90%, 55%)",
      "hsl(160, 75%, 45%)",
      "hsl(290, 70%, 55%)",
      "hsl(25, 85%, 55%)",
      "hsl(200, 80%, 50%)",
    ];

    const colorScale = (group: number) => colors[(group - 1) % colors.length];

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes as any)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      })
      .touchable(() => true);

    svg.call(zoom as any);

    // Links container
    const linksGroup = g.append("g");

    // Nodes
    const nodeGroup = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .style("cursor", "grab")
      .call(
        d3.drag<SVGGElement, any>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
          .touchable(() => true) as any
      );

    nodeGroup
      .append("circle")
      .attr("r", 0)
      .attr("fill", (d) => colorScale(d.group))
      .attr("stroke", "hsl(var(--card))")
      .attr("stroke-width", 3)
      .transition()
      .duration(500)
      .delay((d, i) => i * 50)
      .attr("r", 24);

    nodeGroup
      .append("text")
      .text((d) => d.id)
      .attr("font-size", 14)
      .attr("font-weight", "700")
      .attr("fill", "hsl(var(--card))")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .style("pointer-events", "none")
      .style("user-select", "none")
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 50)
      .style("opacity", 1);

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      d3.select(event.sourceEvent.target.parentNode).style("cursor", "grabbing");
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      d3.select(event.sourceEvent.target.parentNode).style("cursor", "grab");
    }

    simulation.on("tick", () => {
      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
      
      linksGroup.selectAll("line")
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
    });

    // Animation logic
    if (isAnimating && !isPaused) {
      const animateConnections = async () => {
        // Wait for nodes to appear
        await new Promise(resolve => setTimeout(resolve, data.nodes.length * 50 + 500));

        for (let i = 0; i < data.links.length; i++) {
          if (!isAnimating || isPaused) break;
          
          const link = data.links[i];
          const source = data.nodes.find(n => n.id === link.source) as any;
          const target = data.nodes.find(n => n.id === link.target) as any;

          if (!source || !target) continue;

          // Get current positions from simulation
          const sourcePos = simulation.nodes().find((n: any) => n.id === source.id) as any;
          const targetPos = simulation.nodes().find((n: any) => n.id === target.id) as any;

          // Create the line (invisible at first)
          const newLine = linksGroup.append("line")
            .attr("x1", sourcePos.x)
            .attr("y1", sourcePos.y)
            .attr("x2", sourcePos.x)
            .attr("y2", sourcePos.y)
            .attr("stroke", "hsl(var(--muted-foreground))")
            .attr("stroke-width", 3)
            .attr("stroke-opacity", 0.6);

          // Create airplane icon
          const airplane = g.append("g")
            .attr("transform", `translate(${sourcePos.x},${sourcePos.y})`);

          // Airplane SVG path (simplified plane icon)
          airplane.append("path")
            .attr("d", "M0,-8 L-2,-4 L-6,-2 L-2,0 L-3,4 L-1,4 L0,2 L1,4 L3,4 L2,0 L6,-2 L2,-4 Z")
            .attr("fill", "hsl(var(--primary))")
            .attr("stroke", "hsl(var(--card))")
            .attr("stroke-width", 1.5);

          // Add shadow/glow effect
          airplane.append("circle")
            .attr("r", 12)
            .attr("fill", "hsl(var(--primary))")
            .attr("opacity", 0.2);

          // Animate airplane moving
          const duration = 1000;
          
          await new Promise<void>((resolve) => {
            airplane
              .transition()
              .duration(duration)
              .attrTween("transform", () => {
                return (t: number) => {
                  const x = sourcePos.x + (targetPos.x - sourcePos.x) * t;
                  const y = sourcePos.y + (targetPos.y - sourcePos.y) * t;
                  const angle = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x) * 180 / Math.PI;
                  return `translate(${x},${y}) rotate(${angle + 90})`;
                };
              })
              .on("end", () => resolve());

            // Animate line drawing as plane moves
            newLine
              .transition()
              .duration(duration)
              .attr("x2", targetPos.x)
              .attr("y2", targetPos.y);
          });

          // Remove airplane
          airplane.remove();

          setCurrentStep(i + 1);
          
          // Small pause between connections
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        setIsAnimating(false);
      };

      animateConnections();
    }

    return () => {
      simulation.stop();
    };
  }, [data, isAnimating, isPaused]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        {!isAnimating ? (
          <Button onClick={startAnimation} className="bg-gradient-primary hover:opacity-90">
            <Play className="w-4 h-4 mr-2" />
            Start Animation
          </Button>
        ) : (
          <Button onClick={pauseAnimation} variant="secondary">
            <Pause className="w-4 h-4 mr-2" />
            {isPaused ? "Resume" : "Pause"}
          </Button>
        )}
        <Button onClick={resetAnimation} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {isAnimating && (
        <div className="text-center text-sm text-muted-foreground">
          Connecting: {currentStep} / {data.links.length}
        </div>
      )}

      <svg
        ref={svgRef}
        className="w-full h-full rounded-xl bg-[hsl(var(--graph-bg))] border border-[hsl(var(--graph-border))] touch-none"
        style={{ minHeight: "600px", touchAction: "none" }}
      />
    </div>
  );
};
