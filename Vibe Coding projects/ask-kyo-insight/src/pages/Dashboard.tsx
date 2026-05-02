import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { DashboardKPIsComponent } from '@/components/dashboard/DashboardKPIs';
import { IssueCharts } from '@/components/dashboard/IssueCharts';
import { CallsTable } from '@/components/dashboard/CallsTable';
import { EvaluationResults } from '@/components/call-evaluation/EvaluationResults';
import {
  CallEvaluationResult,
  DashboardFilters as Filters,
  DashboardKPIs,
} from '@/types/callEvaluation';
import { mockDashboardKPIs, mockEvaluatedCalls } from '@/data/callEvaluationMock';

export default function Dashboard() {
  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: null, end: null },
    bpos: [],
    teams: [],
    rootCauses: [],
  });
  
  const [calls, setCalls] = useState<(CallEvaluationResult & { id: string; evaluatedAt: string; transcript?: string })[]>([]);
  const [selectedCall, setSelectedCall] = useState<(CallEvaluationResult & { id: string; evaluatedAt: string; transcript?: string }) | null>(null);
  const [kpis, setKPIs] = useState<DashboardKPIs>(mockDashboardKPIs);

  // Load calls from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('evaluatedCalls');
    if (stored) {
      const parsedCalls = JSON.parse(stored);
      setCalls([...parsedCalls, ...mockEvaluatedCalls]);
    } else {
      setCalls(mockEvaluatedCalls);
    }
  }, []);

  // Apply filters
  const filteredCalls = calls.filter(call => {
    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const callDate = new Date(call.evaluatedAt);
      if (callDate < filters.dateRange.start || callDate > filters.dateRange.end) {
        return false;
      }
    }

    // Team filter
    if (filters.teams.length > 0) {
      const callTeams = call.classification_and_tagging.team_assignments?.map(t => t.team_id) || [];
      if (!filters.teams.some(t => callTeams.includes(t))) {
        return false;
      }
    }

    // Root cause filter
    if (filters.rootCauses.length > 0) {
      const callCauses = call.classification_and_tagging.root_causes?.map(r => r.cause) || [];
      if (!filters.rootCauses.some(c => callCauses.includes(c))) {
        return false;
      }
    }

    return true;
  });

  // Calculate KPIs from filtered calls
  useEffect(() => {
    if (filteredCalls.length === 0) {
      setKPIs(mockDashboardKPIs);
      return;
    }

    const totalCalls = filteredCalls.length;
    const totalIssues = filteredCalls.filter(c => c.global_alerts?.length > 0).length;
    const complianceFailures = filteredCalls.filter(c => 
      c.dimension_1_understanding_accuracy_compliance?.compliance?.label === 'fail'
    ).length;
    const incorrectSolutions = filteredCalls.filter(c => 
      c.dimension_5_resolution_closure?.solution_correctness?.label === 'incorrect'
    ).length;
    const escalationsTriggered = filteredCalls.filter(c => 
      c.classification_and_tagging.escalation_triggered
    ).length;
    const averageScore = filteredCalls.reduce((sum, c) => sum + (c.weighted_overall_score || 0), 0) / totalCalls;
    const emotionShiftPositive = Math.round(
      (filteredCalls.filter(c => c.dimension_4_emotional_intelligence?.emotion_shift === 'improved').length / totalCalls) * 100
    );
    const emotionShiftNegative = Math.round(
      (filteredCalls.filter(c => c.dimension_4_emotional_intelligence?.emotion_shift === 'worsened').length / totalCalls) * 100
    );

    setKPIs({
      totalCalls,
      totalIssues,
      complianceFailures,
      incorrectSolutions,
      escalationsTriggered,
      averageScore: isNaN(averageScore) ? 0 : averageScore,
      emotionShiftPositive: isNaN(emotionShiftPositive) ? 0 : emotionShiftPositive,
      emotionShiftNegative: isNaN(emotionShiftNegative) ? 0 : emotionShiftNegative,
    });
  }, [filteredCalls]);

  if (selectedCall) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedCall(null)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <EvaluationResults
            result={selectedCall}
            transcript={selectedCall.transcript || ''}
            onBack={() => setSelectedCall(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Evaluation Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Aggregate insights and analytics from all evaluated calls.
          </p>
        </motion.div>

        {/* Filters */}
        <DashboardFilters filters={filters} onFiltersChange={setFilters} />

        {/* KPIs */}
        <div className="mt-6">
          <DashboardKPIsComponent kpis={kpis} />
        </div>

        {/* Charts */}
        <div className="mt-6">
          <IssueCharts calls={filteredCalls} />
        </div>

        {/* Calls Table */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Evaluated Calls</h3>
          <CallsTable calls={filteredCalls} onSelectCall={setSelectedCall} />
        </div>
      </div>
    </div>
  );
}
