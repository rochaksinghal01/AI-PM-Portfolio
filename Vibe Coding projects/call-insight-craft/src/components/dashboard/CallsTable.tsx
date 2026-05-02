import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreBadge } from "@/components/evaluation/ScoreBadge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Call {
  call_id: string;
  date: string;
  customer_type: string;
  primary_topic: string;
  model_score: number;
  escalation: boolean;
  root_cause: string;
  assigned_team: string;
  emotion_shift: string;
}

interface CallsTableProps {
  calls: Call[];
  onRowClick: (call: Call) => void;
}

export function CallsTable({ calls, onRowClick }: CallsTableProps) {
  const [sortField, setSortField] = useState<keyof Call>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedCalls = [...calls].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc" 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const handleSort = (field: keyof Call) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="dashboard-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Evaluated Calls</h3>
        <p className="text-sm text-muted-foreground mt-1">Click a row to view details</p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead 
                className="cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort("call_id")}
              >
                Call ID
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort("date")}
              >
                Date & Time
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort("primary_topic")}
              >
                Topic
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort("model_score")}
              >
                Score
              </TableHead>
              <TableHead>Escalation</TableHead>
              <TableHead>Root Cause</TableHead>
              <TableHead>Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCalls.map((call) => (
              <TableRow
                key={call.call_id}
                className="data-table-row"
                onClick={() => onRowClick(call)}
              >
                <TableCell className="font-mono text-sm">{call.call_id}</TableCell>
                <TableCell className="text-sm">
                  {format(new Date(call.date), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    call.customer_type === "existing" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-secondary text-secondary-foreground"
                  )}>
                    {call.customer_type}
                  </span>
                </TableCell>
                <TableCell className="text-sm capitalize">
                  {call.primary_topic.replace(/_/g, " ")}
                </TableCell>
                <TableCell>
                  <ScoreBadge score={call.model_score} size="sm" />
                </TableCell>
                <TableCell>
                  {call.escalation ? (
                    <span className="inline-flex items-center gap-1 text-warning">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Yes</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-xs font-medium">No</span>
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-sm capitalize">
                  {call.root_cause.replace(/_/g, " ")}
                </TableCell>
                <TableCell className="text-sm">{call.assigned_team}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
