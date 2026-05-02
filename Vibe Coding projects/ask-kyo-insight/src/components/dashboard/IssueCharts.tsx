import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { PRIMARY_TOPICS, ROOT_CAUSES, TEAMS } from '@/data/callEvaluationMock';
import { CallEvaluationResult } from '@/types/callEvaluation';

interface IssueChartsProps {
  calls: CallEvaluationResult[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
];

export function IssueCharts({ calls }: IssueChartsProps) {
  // Topic distribution
  const topicCounts: Record<string, number> = {};
  calls.forEach(call => {
    const topic = call.classification_and_tagging.primary_topic;
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  });
  
  const topicData = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({
      name: topic.replace(/_/g, ' '),
      value: count,
    }));

  // Root cause distribution
  const rootCauseCounts: Record<string, number> = {};
  calls.forEach(call => {
    const cause = call.classification_and_tagging.root_causes?.[0]?.cause;
    if (cause) {
      rootCauseCounts[cause] = (rootCauseCounts[cause] || 0) + 1;
    }
  });
  
  const rootCauseData = Object.entries(rootCauseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([cause, count]) => ({
      name: cause.replace(/_/g, ' '),
      value: count,
    }));

  // Team distribution
  const teamCounts: Record<string, number> = {};
  calls.forEach(call => {
    const team = call.classification_and_tagging.team_assignments?.find(t => t.role === 'primary_owner')?.team_name;
    if (team) {
      teamCounts[team] = (teamCounts[team] || 0) + 1;
    }
  });
  
  const teamData = Object.entries(teamCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([team, count]) => ({
      name: team.replace(' Team', ''),
      value: count,
    }));

  // If no data, show placeholder
  if (calls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="p-6 bg-card rounded-xl border border-border/50 h-[300px] flex items-center justify-center text-muted-foreground">
          No data to display. Evaluate calls to see analytics.
        </div>
        <div className="p-6 bg-card rounded-xl border border-border/50 h-[300px] flex items-center justify-center text-muted-foreground">
          No data to display. Evaluate calls to see analytics.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Topic Distribution Bar Chart */}
      <div className="p-6 bg-card rounded-xl border border-border/50">
        <h3 className="font-semibold mb-4">Primary Topics (Top 10)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topicData} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              dataKey="name"
              type="category"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              width={75}
              tickFormatter={(value) => value.length > 12 ? value.slice(0, 12) + '...' : value}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Root Cause Pie Chart */}
      <div className="p-6 bg-card rounded-xl border border-border/50">
        <h3 className="font-semibold mb-4">Root Cause Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={rootCauseData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {rootCauseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => <span className="text-xs capitalize">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Team Ownership Distribution */}
      <div className="p-6 bg-card rounded-xl border border-border/50 lg:col-span-2">
        <h3 className="font-semibold mb-4">Team Ownership Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={teamData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={(value) => value.length > 10 ? value.slice(0, 10) + '...' : value}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
