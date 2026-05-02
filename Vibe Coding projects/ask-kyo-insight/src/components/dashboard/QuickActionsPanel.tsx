import { Presentation, FileText, Table, Bell, Zap } from 'lucide-react';
import { QuickAction } from '@/types/kyo';
import { cn } from '@/lib/utils';

interface QuickActionsPanelProps {
  actions: QuickAction[];
  onAction: (actionId: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Presentation,
  FileText,
  Table,
  Bell,
};

export function QuickActionsPanel({ actions, onAction }: QuickActionsPanelProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-medium text-card-foreground">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = iconMap[action.icon] || FileText;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-card-foreground">{action.label}</p>
                <p className="text-[10px] text-muted-foreground">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
