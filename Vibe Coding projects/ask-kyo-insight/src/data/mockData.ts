import { UserContext, DataSource, QuickQuestion, QuickAction, EntryPoint, KyoOutput, KyoInsight, ExportOption, Team } from '@/types/kyo';

export const currentUser: UserContext = {
  id: '1',
  name: 'Rochak',
  email: 'rochak@company.com',
  team: 'marketing',
  seniority: 'manager',
  permissions: ['view_all_feedback', 'export_data', 'create_reports', 'manage_alerts'],
};

export const dataSources: DataSource[] = [
  { id: '1', name: 'Salesforce CRM', type: 'crm', lastSync: '2 min ago', recordCount: 45230 },
  { id: '2', name: 'NPS Surveys', type: 'nps', lastSync: '15 min ago', recordCount: 12450 },
  { id: '3', name: 'Zendesk Tickets', type: 'support', lastSync: '5 min ago', recordCount: 89320 },
  { id: '4', name: 'App Store Reviews', type: 'reviews', lastSync: '1 hour ago', recordCount: 5670 },
  { id: '5', name: 'Google Analytics', type: 'analytics', lastSync: '10 min ago', recordCount: 234000 },
];

export const teamQuestions: Record<Team, QuickQuestion[]> = {
  product: [
    { id: '1', question: 'What are the top feature requests this month?', category: 'Features', popularity: 95 },
    { id: '2', question: 'Which bugs are most impacting user satisfaction?', category: 'Quality', popularity: 88 },
    { id: '3', question: 'How does our NPS compare to last quarter?', category: 'Metrics', popularity: 82 },
    { id: '4', question: 'What\'s driving churn in enterprise accounts?', category: 'Retention', popularity: 79 },
  ],
  marketing: [
    { id: '1', question: 'Why did ROAS change in the last 7 days?', category: 'Performance', popularity: 95 },
    { id: '2', question: 'Which products faced quality complaints this week?', category: 'Quality', popularity: 90 },
    { id: '3', question: 'Which audiences are driving higher CAC?', category: 'Acquisition', popularity: 85 },
    { id: '4', question: 'What changed after the latest creative launch?', category: 'Campaigns', popularity: 82 },
    { id: '5', question: 'Are complaints affecting conversion?', category: 'Impact', popularity: 78 },
  ],
  cx: [
    { id: '1', question: 'What are the top support pain points?', category: 'Support', popularity: 96 },
    { id: '2', question: 'Which issues have the longest resolution time?', category: 'Efficiency', popularity: 89 },
    { id: '3', question: 'What\'s causing repeat contacts?', category: 'Quality', popularity: 84 },
    { id: '4', question: 'How satisfied are customers after support interactions?', category: 'CSAT', popularity: 80 },
  ],
  ops: [
    { id: '1', question: 'Where are the biggest delivery delays?', category: 'Logistics', popularity: 94 },
    { id: '2', question: 'What\'s the return rate by product category?', category: 'Returns', popularity: 87 },
    { id: '3', question: 'Which fulfillment centers have issues?', category: 'Operations', popularity: 81 },
    { id: '4', question: 'What inventory feedback are customers giving?', category: 'Stock', popularity: 76 },
  ],
  leadership: [
    { id: '1', question: 'Executive summary: Customer health this quarter', category: 'Overview', popularity: 98 },
    { id: '2', question: 'What are the biggest risks to retention?', category: 'Risk', popularity: 95 },
    { id: '3', question: 'How are we trending vs competitors?', category: 'Market', popularity: 90 },
    { id: '4', question: 'Where should we invest to improve CX?', category: 'Strategy', popularity: 88 },
  ],
};

export const quickActions: QuickAction[] = [
  { id: '1', label: 'Build PPT', icon: 'Presentation', description: 'Create executive deck' },
  { id: '2', label: 'Create Doc', icon: 'FileText', description: 'Generate report' },
  { id: '3', label: 'Make Sheet', icon: 'Table', description: 'Export data table' },
  { id: '4', label: 'Set Reminder', icon: 'Bell', description: 'Schedule follow-up' },
];

export const entryPoints: EntryPoint[] = [
  {
    id: 'teams-main',
    name: 'Teams Main Screen',
    description: 'Ask questions, build outputs, set reminders',
    icon: 'Layout',
    inputTypes: ['text', 'voice'],
    features: ['Top questions', 'Build PPT/Doc/Sheet', 'Set reminders', 'Draft messages'],
  },
  {
    id: 'teams-chat',
    name: 'Teams Chat',
    description: 'Companion mode in conversations',
    icon: 'MessageSquare',
    inputTypes: ['text', 'screenshot'],
    features: ['Answer ad-hoc questions', 'Take notes', 'Generate documents'],
  },
  {
    id: 'meetings',
    name: 'Meetings',
    description: 'Live assistance during calls',
    icon: 'Video',
    inputTypes: ['voice', 'text'],
    features: ['Live summary', 'Meeting minutes', 'Action items', 'Real-time answers'],
  },
  {
    id: 'huddle',
    name: 'Huddle Mode',
    description: 'Quick brainstorms with instant insights',
    icon: 'Users',
    inputTypes: ['voice', 'text'],
    features: ['Quick brainstorm', 'Instant numbers', 'Auto-record summary', 'Create follow-ups'],
  },
  {
    id: 'email',
    name: 'Gmail Sidebar',
    description: 'Draft and manage email communications',
    icon: 'Mail',
    inputTypes: ['text', 'file'],
    features: ['Draft from context', 'Suggest replies', 'Convert to actions', 'Manage stakeholders'],
  },
];

export const sampleInsight: KyoInsight = {
  id: '1',
  summary: 'Quality complaints increased across 3 SKUs in the last 7 days.',
  cause: 'VC (86 fading), Hustlr (45 nosepad), JJ (50 size mismatch).',
  businessImpact: {
    metric: 'conversion',
    value: '-5%',
    direction: 'down',
  },
  suggestedAction: 'Improve product messaging; test creatives for 18–25, Mumbai + Bangalore.',
  problemTag: 'quality',
  metricTag: 'conversion',
  timeRange: '7d',
  sources: ['Tickets', 'Reviews', 'Returns'],
  timestamp: new Date().toISOString(),
};

export const sampleOutput: KyoOutput = {
  id: '1',
  summary: 'Enterprise customers are experiencing 3x more checkout failures than SMB accounts. The primary driver is payment gateway timeouts during peak hours (2-5 PM EST). This correlates with a 12% increase in support tickets mentioning "payment issues" over the past 2 weeks.',
  evidence: {
    quotes: [
      '"Payment keeps failing at the last step, tried 4 times yesterday" — Enterprise Account Manager',
      '"We\'re losing deals because clients can\'t complete purchase" — Sales Team',
      '"Checkout timeout is killing our conversion rate" — Product Review',
    ],
    metrics: [
      { label: 'Checkout Failures', value: '+340%', trend: 'up' },
      { label: 'Affected Revenue', value: '$2.4M', trend: 'down' },
      { label: 'Support Tickets', value: '+12%', trend: 'up' },
      { label: 'NPS Impact', value: '-8 pts', trend: 'down' },
    ],
  },
  confidenceScore: 94,
  timestamp: '2024-01-15T10:30:00Z',
  sources: ['Zendesk Tickets', 'Salesforce CRM', 'NPS Surveys', 'App Analytics'],
  businessImpact: {
    category: 'conversion',
    severity: 'high',
  },
};

export const exportOptions: ExportOption[] = [
  { id: 'ppt', label: 'Create PPT', icon: 'Presentation', description: 'Create slide deck' },
  { id: 'doc', label: 'Create Doc', icon: 'FileText', description: 'Generate document' },
  { id: 'sheet', label: 'Create Table', icon: 'Table', description: 'Export as table' },
];
