import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { GraphData } from "@/lib/graphAlgorithms";

interface GraphVisualizationProps {
  data: GraphData;
}

export const GraphVisualization = ({ data }: GraphVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Color scale for different groups
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

    // Create container groups
    const g = svg.append("g");

    // Add zoom behavior with touch support
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      })
      .touchable(() => true); // Enable touch support

    svg.call(zoom as any);

    // Draw links
    const link = g.append("g")
      .attr("stroke", "hsl(var(--muted-foreground))")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 2)
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line");

    // Create node groups to hold circle, icon, and label
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
          .touchable(() => true) as any // Enable touch dragging
      );

    // Draw outer circles (bubbles)
    const node = nodeGroup
      .append("circle")
      .attr("r", 24)
      .attr("fill", (d) => colorScale(d.group))
      .attr("stroke", "hsl(var(--card))")
      .attr("stroke-width", 3)
      .attr("opacity", 0.9);

    // Draw inner circles for person background
    nodeGroup
      .append("circle")
      .attr("r", 18)
      .attr("fill", "hsl(var(--card))")
      .attr("opacity", 0.95);

    // Add person icon using SVG path (simplified person silhouette)
    nodeGroup
      .append("path")
      .attr("d", "M0,-6 C2,-6 3,-5 3,-3 C3,-1 2,0 0,0 C-2,0 -3,-1 -3,-3 C-3,-5 -2,-6 0,-6 M-4,2 C-4,2 -5,4 -5,8 L5,8 C5,4 4,2 4,2 C4,1 2,1 0,1 C-2,1 -4,1 -4,2")
      .attr("fill", (d) => colorScale(d.group))
      .attr("opacity", 0.8)
      .style("pointer-events", "none");

    // Add number labels
    const label = nodeGroup
      .append("text")
      .text((d) => d.id)
      .attr("font-size", 11)
      .attr("font-weight", "700")
      .attr("fill", (d) => colorScale(d.group))
      .attr("text-anchor", "middle")
      .attr("dy", 16)
      .style("pointer-events", "none")
      .style("user-select", "none");

    // Add hover effects
    nodeGroup
      .on("mouseenter", function() {
        const circles = d3.select(this).selectAll("circle");
        circles.filter((d, i) => i === 0)
          .transition()
          .duration(200)
          .attr("r", 28)
          .attr("stroke-width", 4);
        
        circles.filter((d, i) => i === 1)
          .transition()
          .duration(200)
          .attr("r", 21);
      })
      .on("mouseleave", function() {
        const circles = d3.select(this).selectAll("circle");
        circles.filter((d, i) => i === 0)
          .transition()
          .duration(200)
          .attr("r", 24)
          .attr("stroke-width", 3);
        
        circles.filter((d, i) => i === 1)
          .transition()
          .duration(200)
          .attr("r", 18);
      });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      d3.select(event.sourceEvent.target).style("cursor", "grabbing");
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      d3.select(event.sourceEvent.target).style("cursor", "grab");
    }

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full rounded-xl bg-[hsl(var(--graph-bg))] border border-[hsl(var(--graph-border))] touch-none"
      style={{ minHeight: "600px", touchAction: "none" }}
    />
  );
};
