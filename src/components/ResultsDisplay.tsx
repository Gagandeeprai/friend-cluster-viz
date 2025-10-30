import { Card, CardContent } from "@/components/ui/card";
import { Users, Network, Layers, TrendingUp } from "lucide-react";

interface ResultsDisplayProps {
  components: number;
  totalStudents: number;
  totalConnections: number;
  componentDetails?: { id: number; size: number }[];
}

export const ResultsDisplay = ({ components, totalStudents, totalConnections, componentDetails }: ResultsDisplayProps) => {
  const avgGroupSize = componentDetails && componentDetails.length > 0
    ? (componentDetails.reduce((sum, c) => sum + c.size, 0) / componentDetails.length).toFixed(1)
    : 0;

  const largestGroup = componentDetails && componentDetails.length > 0
    ? Math.max(...componentDetails.map(c => c.size))
    : 0;

  return (
    <div className="space-y-4 w-full animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="p-3 rounded-xl bg-green-500/10">
              <Users className="w-6 h-6 text-green-600 dark:text-green-500" />
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
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Network className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connections</p>
              <p className="text-3xl font-bold text-foreground">{totalConnections}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {componentDetails && componentDetails.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-[hsl(var(--border))] bg-card shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Group Statistics</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Average Size</p>
                    <p className="text-xl font-bold text-foreground">{avgGroupSize}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Largest Group</p>
                    <p className="text-xl font-bold text-foreground">{largestGroup}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--border))] bg-card shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground mb-2">Group Size Distribution</p>
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                  {componentDetails.map((comp) => (
                    <div key={comp.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Group {comp.id}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                            style={{ width: `${(comp.size / largestGroup) * 100}%` }}
                          />
                        </div>
                        <span className="font-semibold text-foreground w-8 text-right">{comp.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
