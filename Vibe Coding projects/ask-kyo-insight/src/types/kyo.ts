export type Team = 'marketing' | 'cx' | 'ops' | 'product' | 'leadership';
export type Seniority = 'entry' | 'mid' | 'senior' | 'manager' | 'c-level';
export type TimeRange = '24h' | '7d' | '30d' | 'custom';
export type ProblemTag = 'quality' | 'delivery' | 'pricing' | 'ux' | 'returns';
export type MetricTag = 'conversion' | 'roas' | 'sla' | 'churn' | 'returns';

export interface UserContext {
  id: string;
  name: string;
  email: string;
  team: Team;
  seniority: Seniority;
  permissions: string[];
  avatar?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'crm' | 'nps' | 'support' | 'reviews' | 'analytics' | 'surveys';
  lastSync: string;
  recordCount: number;
}

export interface QuickQuestion {
  id: string;
  question: string;
  category: string;
  popularity: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface EntryPoint {
  id: string;
  name: string;
  description: string;
  icon: string;
  inputTypes: ('text' | 'voice' | 'screenshot' | 'file')[];
  features: string[];
}

export interface KyoInsight {
  id: string;
  summary: string;
  cause: string;
  businessImpact: {
    metric: MetricTag;
    value: string;
    direction: 'up' | 'down' | 'stable';
  };
  suggestedAction: string;
  problemTag: ProblemTag;
  metricTag: MetricTag;
  timeRange: TimeRange;
  sources: string[];
  timestamp: string;
}

export interface KyoOutput {
  id: string;
  summary: string;
  evidence: {
    quotes: string[];
    metrics: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }[];
  };
  confidenceScore: number;
  timestamp: string;
  sources: string[];
  businessImpact: {
    category: 'churn' | 'loyalty' | 'conversion' | 'delivery';
    severity: 'high' | 'medium' | 'low';
  };
}

export interface ExportOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}
