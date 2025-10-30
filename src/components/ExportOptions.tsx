import { Button } from "@/components/ui/button";
import { Download, FileJson, Image } from "lucide-react";
import { GraphData } from "@/lib/graphAlgorithms";
import { toast } from "sonner";

interface ExportOptionsProps {
  graphData: GraphData;
  svgRef?: React.RefObject<SVGSVGElement>;
}

export const ExportOptions = ({ graphData, svgRef }: ExportOptionsProps) => {
  const exportJSON = () => {
    const dataStr = JSON.stringify(graphData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `graph-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Graph data exported as JSON");
  };

  const exportSVG = () => {
    if (!svgRef?.current) {
      toast.error("Graph visualization not available");
      return;
    }

    const svgData = svgRef.current.outerHTML;
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `graph-visualization-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Graph visualization exported as SVG");
  };

  const exportCSV = () => {
    const csvHeader = "Source,Target,Group\n";
    const csvRows = graphData.links
      .map((link) => {
        const sourceNode = graphData.nodes.find((n) => n.id === link.source);
        const targetNode = graphData.nodes.find((n) => n.id === link.target);
        const group = sourceNode?.group || 0;
        return `${link.source},${link.target},${group}`;
      })
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `graph-edges-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Graph edges exported as CSV");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportJSON}
        className="flex items-center gap-2"
      >
        <FileJson className="w-4 h-4" />
        Export JSON
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportCSV}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </Button>
      {svgRef && (
        <Button
          variant="outline"
          size="sm"
          onClick={exportSVG}
          className="flex items-center gap-2"
        >
          <Image className="w-4 h-4" />
          Export SVG
        </Button>
      )}
    </div>
  );
};
