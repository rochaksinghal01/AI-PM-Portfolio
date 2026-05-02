import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Eye,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CallEvaluationResult } from '@/types/callEvaluation';
import { format } from 'date-fns';

interface CallsTableProps {
  calls: (CallEvaluationResult & { id: string; evaluatedAt: string })[];
  onSelectCall: (call: CallEvaluationResult & { id: string; evaluatedAt: string }) => void;
}

type SortField = 'date' | 'score' | 'topic';
type SortDirection = 'asc' | 'desc';

export function CallsTable({ calls, onSelectCall }: CallsTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCalls = [...calls].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'date':
        comparison = new Date(a.evaluatedAt).getTime() - new Date(b.evaluatedAt).getTime();
        break;
      case 'score':
        comparison = a.weighted_overall_score - b.weighted_overall_score;
        break;
      case 'topic':
        comparison = a.classification_and_tagging.primary_topic.localeCompare(
          b.classification_and_tagging.primary_topic
        );
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 px-2 -ml-2 font-medium"
    >
      {children}
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )
      ) : (
        <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />
      )}
    </Button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border/50 overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead><SortButton field="date">Date & Time</SortButton></TableHead>
            <TableHead>Call ID</TableHead>
            <TableHead>Customer Type</TableHead>
            <TableHead><SortButton field="topic">Primary Topic</SortButton></TableHead>
            <TableHead><SortButton field="score">Score</SortButton></TableHead>
            <TableHead>Escalation</TableHead>
            <TableHead>Root Cause</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCalls.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No calls found. Evaluate a call to see it here.
              </TableCell>
            </TableRow>
          ) : (
            sortedCalls.map((call, index) => (
              <motion.tr
                key={call.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={() => onSelectCall(call)}
              >
                <TableCell className="font-mono text-sm">
                  {format(new Date(call.evaluatedAt), 'MMM d, yyyy HH:mm')}
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {call.id}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {call.call_metadata.customer_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {call.classification_and_tagging.primary_topic.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "font-semibold",
                    call.weighted_overall_score >= 80 ? "text-green-500" :
                    call.weighted_overall_score >= 60 ? "text-yellow-500" :
                    "text-red-500"
                  )}>
                    {call.weighted_overall_score.toFixed(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {call.classification_and_tagging.escalation_triggered ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      No
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize text-xs">
                    {call.classification_and_tagging.root_causes?.[0]?.cause?.replace(/_/g, ' ') || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {call.classification_and_tagging.team_assignments?.find(t => t.role === 'primary_owner')?.team_name || 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCall(call);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}
