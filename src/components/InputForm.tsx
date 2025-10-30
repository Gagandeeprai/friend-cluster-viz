import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface InputFormProps {
  onAnalyze: (n: number, edges: [number, number][]) => void;
}

export const InputForm = ({ onAnalyze }: InputFormProps) => {
  const [n, setN] = useState("");
  const [edgesText, setEdgesText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numStudents = parseInt(n);
    if (isNaN(numStudents) || numStudents < 1) {
      toast.error("Please enter a valid number of students (at least 1)");
      return;
    }

    if (numStudents > 100000) {
      toast.error("Number of students cannot exceed 100,000");
      return;
    }

    try {
      const edges: [number, number][] = edgesText
        .split(",")
        .map(pair => {
          const [u, v] = pair.trim().split(/\s+/).map(Number);
          if (isNaN(u) || isNaN(v) || u < 1 || u > numStudents || v < 1 || v > numStudents) {
            throw new Error("Invalid edge");
          }
          return [u, v] as [number, number];
        })
        .filter(([u, v]) => u !== undefined && v !== undefined);

      onAnalyze(numStudents, edges);
      toast.success("Graph analyzed successfully!");
    } catch (error) {
      toast.error("Invalid edge format. Use: u v, u v (e.g., 1 2, 2 3)");
    }
  };

  const loadExample = () => {
    setN("6");
    setEdgesText("1 2, 2 3, 4 5, 5 6");
    toast.info("Example loaded! Click Visualize to see the result.");
  };

  return (
    <Card className="w-full shadow-md border-[hsl(var(--border))] bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-primary" />
          <CardTitle>Graph Input</CardTitle>
        </div>
        <CardDescription>
          Enter the number of students and their connections to analyze friend groups
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="students">Number of Students (n)</Label>
            <Input
              id="students"
              type="number"
              placeholder="e.g., 6"
              value={n}
              onChange={(e) => setN(e.target.value)}
              min="1"
              max="100000"
              className="bg-background"
              required
            />
            <p className="text-xs text-muted-foreground">
              Range: 1 to 100,000 students
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edges">Connections (u v, comma-separated)</Label>
            <Textarea
              id="edges"
              placeholder="1 2, 2 3, 4 5, 5 6"
              value={edgesText}
              onChange={(e) => setEdgesText(e.target.value)}
              rows={4}
              className="font-mono text-sm bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Format: Each pair represents a connection between two students
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Visualize Graph
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={loadExample}
            >
              Load Example
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
