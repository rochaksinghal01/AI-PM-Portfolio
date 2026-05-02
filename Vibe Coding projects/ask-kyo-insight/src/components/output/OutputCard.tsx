import { Clock, ExternalLink, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { KyoOutput } from '@/types/kyo';
import { cn } from '@/lib/utils';

interface OutputCardProps {
  output: KyoOutput;
}

const severityConfig = {
  high: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'High Impact' },
  medium: { bg: 'bg-warning/10', text: 'text-warning', label: 'Medium Impact' },
  low: { bg: 'bg-info/10', text: 'text-info', label: 'Low Impact' },
};

const categoryLabels = {
  churn: 'Churn Risk',
  loyalty: 'Loyalty',
  conversion: 'Conversion',
  delivery: 'Delivery',
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export function OutputCard({ output }: OutputCardProps) {
  const severity = severityConfig[output.businessImpact.severity];
  const formattedDate = new Date(output.timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('px-2.5 py-1 rounded-full text-xs font-medium', severity.bg, severity.text)}>
              {categoryLabels[output.businessImpact.category]}: {severity.label}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formattedDate}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
              output.confidenceScore >= 80 ? 'bg-success/10 text-success' :
              output.confidenceScore >= 60 ? 'bg-warning/10 text-warning' :
              'bg-destructive/10 text-destructive'
            )}>
              {output.confidenceScore >= 80 ? <CheckCircle className="w-3 h-3" /> :
               output.confidenceScore >= 60 ? <Info className="w-3 h-3" /> :
               <AlertTriangle className="w-3 h-3" />}
              {output.confidenceScore}% confidence
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 py-4">
        <h3 className="text-sm font-medium text-card-foreground mb-2">Summary</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{output.summary}</p>
      </div>

      {/* Evidence */}
      <div className="px-5 py-4 border-t border-border">
        <h3 className="text-sm font-medium text-card-foreground mb-3">Evidence</h3>
        
        {/* Quotes */}
        <div className="space-y-2 mb-4">
          {output.evidence.quotes.map((quote, index) => (
            <div key={index} className="flex gap-2 text-sm">
              <span className="text-muted-foreground">"</span>
              <p className="text-muted-foreground italic flex-1">{quote}</p>
              <span className="text-muted-foreground">"</span>
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {output.evidence.metrics.map((metric, index) => {
            const TrendIcon = metric.trend ? trendIcons[metric.trend] : Minus;
            const isNegative = metric.trend === 'up' && (metric.label.includes('Failure') || metric.label.includes('Ticket'));
            const trendColor = metric.trend === 'up' 
              ? (isNegative ? 'text-destructive' : 'text-success')
              : metric.trend === 'down'
              ? (isNegative ? 'text-success' : 'text-destructive')
              : 'text-muted-foreground';
            
            return (
              <div key={index} className="bg-muted/50 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{metric.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-semibold text-card-foreground">{metric.value}</span>
                  {metric.trend && <TrendIcon className={cn('w-4 h-4', trendColor)} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sources */}
      <div className="px-5 py-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sources:</span>
            <div className="flex items-center gap-1.5">
              {output.sources.map((source, index) => (
                <span key={index} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {source}
                </span>
              ))}
            </div>
          </div>
          <button className="text-xs text-primary hover:underline flex items-center gap-1">
            View details <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
