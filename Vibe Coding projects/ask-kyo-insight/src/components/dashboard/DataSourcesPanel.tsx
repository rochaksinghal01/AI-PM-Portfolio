import { Database, RefreshCw } from 'lucide-react';
import { DataSource } from '@/types/kyo';
import { cn } from '@/lib/utils';

interface DataSourcesPanelProps {
  sources: DataSource[];
}

const sourceIcons: Record<DataSource['type'], string> = {
  crm: '💼',
  nps: '📊',
  support: '🎧',
  reviews: '⭐',
  analytics: '📈',
  surveys: '📝',
};

export function DataSourcesPanel({ sources }: DataSourcesPanelProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-card-foreground">Connected Data Sources</h3>
        </div>
        <button className="text-xs text-primary hover:underline flex items-center gap-1">
          <RefreshCw className="w-3 h-3" />
          Sync All
        </button>
      </div>
      
      <div className="space-y-2">
        {sources.map((source) => (
          <div
            key={source.id}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{sourceIcons[source.type]}</span>
              <div>
                <p className="text-sm font-medium text-card-foreground">{source.name}</p>
                <p className="text-xs text-muted-foreground">
                  {source.recordCount.toLocaleString()} records
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">{source.lastSync}</span>
            </div>
          </div>
        ))}
      </div>
      
      <p className="mt-4 text-xs text-muted-foreground text-center">
        Ask Kyo analyzes feedback from all connected sources to provide unified insights.
      </p>
    </div>
  );
}
