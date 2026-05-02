import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KPICard } from "@/components/dashboard/KPICard";
import { CallsTable } from "@/components/dashboard/CallsTable";
import { TopicDistributionChart, RootCauseChart, TeamDistributionChart } from "@/components/dashboard/Charts";
import { CallDetailModal } from "@/components/dashboard/CallDetailModal";
import { 
  mockDashboardCalls, 
  mockKPIs, 
  mockTopicDistribution, 
  mockRootCauseDistribution,
  mockTeamDistribution 
} from "@/lib/mockData";
import { 
  Phone, 
  AlertTriangle, 
  ShieldAlert, 
  XCircle, 
  TrendingUp,
  BarChart3,
  Heart
} from "lucide-react";

export default function Dashboard() {
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (call: any) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };

  const handleFilterChange = (filters: any) => {
    console.log("Filters changed:", filters);
    // In a real app, this would filter the data
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of call quality metrics and insights
          </p>
        </div>

        {/* Filters */}
        <FilterBar onFilterChange={handleFilterChange} />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <KPICard
            title="Total Calls"
            value={mockKPIs.totalCalls}
            icon={<Phone className="h-5 w-5" />}
            trend={12}
            trendLabel="vs last week"
            delay={0}
          />
          <KPICard
            title="Issues Detected"
            value={mockKPIs.issuesDetected}
            icon={<AlertTriangle className="h-5 w-5" />}
            trend={-8}
            trendLabel="vs last week"
            variant="warning"
            delay={0.05}
          />
          <KPICard
            title="Compliance Fails"
            value={mockKPIs.complianceFailures}
            icon={<ShieldAlert className="h-5 w-5" />}
            variant="danger"
            delay={0.1}
          />
          <KPICard
            title="Wrong Solutions"
            value={mockKPIs.incorrectSolutions}
            icon={<XCircle className="h-5 w-5" />}
            variant="danger"
            delay={0.15}
          />
          <KPICard
            title="Escalations"
            value={mockKPIs.escalationsTriggered}
            icon={<TrendingUp className="h-5 w-5" />}
            variant="warning"
            delay={0.2}
          />
          <KPICard
            title="Avg Score"
            value={mockKPIs.averageScore.toFixed(1)}
            icon={<BarChart3 className="h-5 w-5" />}
            variant="success"
            delay={0.25}
          />
          <KPICard
            title="Emotion ↑"
            value={`${mockKPIs.emotionImprovement}%`}
            icon={<Heart className="h-5 w-5" />}
            variant="success"
            delay={0.3}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TopicDistributionChart data={mockTopicDistribution} />
          <RootCauseChart data={mockRootCauseDistribution} />
          <TeamDistributionChart data={mockTeamDistribution} />
        </div>

        {/* Calls Table */}
        <CallsTable calls={mockDashboardCalls} onRowClick={handleRowClick} />

        {/* Detail Modal */}
        <CallDetailModal
          call={selectedCall}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
