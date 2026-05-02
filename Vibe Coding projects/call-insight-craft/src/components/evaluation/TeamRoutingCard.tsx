import { 
  Users, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamRoutingCardProps {
  data: any;
}

export function TeamRoutingCard({ data }: TeamRoutingCardProps) {
  const { classification_and_tagging } = data;
  const { team_assignments, escalation_triggered, escalation_reason } = classification_and_tagging;

  const primaryTeam = team_assignments.find((t: any) => t.role === "primary_owner");
  const secondaryTeams = team_assignments.filter((t: any) => t.role === "secondary_owner");
  const notifyTeams = team_assignments.filter((t: any) => t.role === "notify");

  return (
    <div className="dashboard-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Team Routing</h3>
          <p className="text-sm text-muted-foreground mt-1">Assignment based on RAG mappings</p>
        </div>
        {escalation_triggered ? (
          <span className="alert-badge alert-warning">
            <AlertCircle className="h-3.5 w-3.5" />
            Escalation Triggered
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-success/10 text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Standard Routing
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Primary Team */}
        {primaryTeam && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Primary Owner</p>
                <p className="text-sm font-semibold text-foreground">{primaryTeam.team_name}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{primaryTeam.reason}</p>
          </div>
        )}

        {/* Secondary Teams */}
        {secondaryTeams.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Secondary Owners</p>
            {secondaryTeams.map((team: any) => (
              <div key={team.team_id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{team.team_name}</p>
                  <p className="text-xs text-muted-foreground">{team.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notify Teams */}
        {notifyTeams.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notify</p>
            <div className="flex flex-wrap gap-2">
              {notifyTeams.map((team: any) => (
                <span key={team.team_id} className="px-3 py-1.5 rounded-full bg-secondary text-sm text-foreground">
                  {team.team_name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Escalation Reason */}
        {escalation_triggered && escalation_reason && (
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-xs font-medium text-warning uppercase tracking-wider mb-1">Escalation Reason</p>
            <p className="text-sm text-foreground">{escalation_reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}
