import { Presentation, FileText, Table, Calendar, Ticket, Send, Clock, ChevronDown } from 'lucide-react';
import { ExportOption } from '@/types/kyo';
import { cn } from '@/lib/utils';

interface ExportActionsProps {
  options: ExportOption[];
  onExport: (optionId: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Presentation,
  FileText,
  Table,
  Calendar,
  Ticket,
  Send,
  Clock,
};

export function ExportActions({ options, onExport }: ExportActionsProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-card">
      <h3 className="text-sm font-medium text-card-foreground mb-3">Export & Actions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {options.map((option) => {
          const Icon = iconMap[option.icon] || FileText;
          return (
            <button
              key={option.id}
              onClick={() => onExport(option.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-card-foreground">{option.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
