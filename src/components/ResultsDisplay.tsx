import { Card, CardContent } from "@/components/ui/card";
import { Users, Network, Layers } from "lucide-react";

interface ResultsDisplayProps {
  components: number;
  totalStudents: number;
  totalConnections: number;
}

export const ResultsDisplay = ({ components, totalStudents, totalConnections }: ResultsDisplayProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full animate-slide-up">
      <Card className="border-[hsl(var(--border))] bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Friend Groups</p>
              <p className="text-3xl font-bold text-foreground">{components}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[hsl(var(--border))] bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/10">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[hsl(var(--border))] bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-accent/10">
              <Network className="w-6 h-6" style={{ color: "hsl(265, 85%, 65%)" }} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connections</p>
              <p className="text-3xl font-bold text-foreground">{totalConnections}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
