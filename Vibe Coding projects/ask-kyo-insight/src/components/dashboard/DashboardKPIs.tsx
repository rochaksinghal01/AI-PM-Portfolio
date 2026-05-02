import { motion } from 'framer-motion';
import {
  PhoneCall,
  AlertTriangle,
  ShieldX,
  XCircle,
  TrendingUp,
  BarChart3,
  Smile,
  Frown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardKPIs as KPIs } from '@/types/callEvaluation';

interface DashboardKPIsProps {
  kpis: KPIs;
}

function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  delay,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 bg-card rounded-xl border border-border/50 hover:border-border transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <TrendingUp className={cn(
            "w-4 h-4",
            trend === 'up' ? "text-green-500" : "text-red-500 rotate-180"
          )} />
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
    </motion.div>
  );
}

export function DashboardKPIsComponent({ kpis }: DashboardKPIsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      <KPICard
        title="Total Calls"
        value={kpis.totalCalls.toLocaleString()}
        icon={PhoneCall}
        color="bg-blue-500/10 text-blue-500"
        delay={0}
      />
      <KPICard
        title="Issues Detected"
        value={kpis.totalIssues}
        icon={AlertTriangle}
        color="bg-yellow-500/10 text-yellow-500"
        delay={0.05}
      />
      <KPICard
        title="Compliance Fails"
        value={kpis.complianceFailures}
        icon={ShieldX}
        color="bg-red-500/10 text-red-500"
        delay={0.1}
      />
      <KPICard
        title="Wrong Solutions"
        value={kpis.incorrectSolutions}
        icon={XCircle}
        color="bg-orange-500/10 text-orange-500"
        delay={0.15}
      />
      <KPICard
        title="Escalations"
        value={kpis.escalationsTriggered}
        icon={TrendingUp}
        color="bg-purple-500/10 text-purple-500"
        delay={0.2}
      />
      <KPICard
        title="Avg Score"
        value={kpis.averageScore.toFixed(1)}
        icon={BarChart3}
        color="bg-green-500/10 text-green-500"
        delay={0.25}
      />
      <KPICard
        title="Positive Shift"
        value={`${kpis.emotionShiftPositive}%`}
        icon={Smile}
        color="bg-emerald-500/10 text-emerald-500"
        delay={0.3}
      />
      <KPICard
        title="Negative Shift"
        value={`${kpis.emotionShiftNegative}%`}
        icon={Frown}
        color="bg-rose-500/10 text-rose-500"
        delay={0.35}
      />
    </div>
  );
}
