import { User, Users, Search, Database, Sparkles, Shield, FileOutput, ArrowRight } from 'lucide-react';

const workflowSteps = [
  {
    id: 1,
    icon: User,
    label: 'User Question',
    description: 'Natural language input',
    color: 'bg-info/20 text-info',
  },
  {
    id: 2,
    icon: Users,
    label: 'Context Check',
    description: 'Team + Seniority',
    color: 'bg-team-product/20 text-team-product',
  },
  {
    id: 3,
    icon: Search,
    label: 'RAG Retrieval',
    description: 'Customer feedback',
    color: 'bg-team-cx/20 text-team-cx',
  },
  {
    id: 4,
    icon: Database,
    label: 'Data Fetch',
    description: 'NPS, churn, metrics',
    color: 'bg-team-ops/20 text-team-ops',
  },
  {
    id: 5,
    icon: Sparkles,
    label: 'Fusion',
    description: 'Unified insight',
    color: 'bg-primary/20 text-primary',
  },
  {
    id: 6,
    icon: Shield,
    label: 'Guardrails',
    description: 'Permissions, redaction',
    color: 'bg-warning/20 text-warning',
  },
  {
    id: 7,
    icon: FileOutput,
    label: 'Output',
    description: 'Requested format',
    color: 'bg-success/20 text-success',
  },
];

export function IntelligenceWorkflow() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">How Ask Kyo Works</h2>
        <p className="text-sm text-muted-foreground">The intelligence layer behind every answer</p>
      </div>
      
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        {/* Desktop workflow */}
        <div className="hidden lg:flex items-center justify-between gap-2">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-card-foreground">{step.label}</p>
                  <p className="text-[10px] text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < workflowSteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground mx-2 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile workflow */}
        <div className="lg:hidden space-y-3">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${step.color} flex items-center justify-center flex-shrink-0`}>
                <step.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < workflowSteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
        
        {/* Impact indicator */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">This insight impacts:</span>
            <div className="flex items-center gap-2">
              {['Churn', 'Loyalty', 'Conversion', 'Delivery'].map((impact) => (
                <span
                  key={impact}
                  className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground"
                >
                  {impact}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
