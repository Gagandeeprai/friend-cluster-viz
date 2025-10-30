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

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

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

    // Draw nodes
    const node = g.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", 16)
      .attr("fill", (d) => colorScale(d.group))
      .attr("stroke", "hsl(var(--card))")
      .attr("stroke-width", 3)
      .style("cursor", "grab")
      .call(
        d3.drag<SVGCircleElement, any>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      );

    // Add hover effects
    node
      .on("mouseenter", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 20)
          .attr("stroke-width", 4);
      })
      .on("mouseleave", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 16)
          .attr("stroke-width", 3);
      });

    // Add labels
    const label = g.append("g")
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .text((d) => d.id)
      .attr("font-size", 13)
      .attr("font-weight", "600")
      .attr("fill", "hsl(var(--card))")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .style("pointer-events", "none")
      .style("user-select", "none");

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

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full rounded-xl bg-[hsl(var(--graph-bg))] border border-[hsl(var(--graph-border))]"
      style={{ minHeight: "600px" }}
    />
  );
};
