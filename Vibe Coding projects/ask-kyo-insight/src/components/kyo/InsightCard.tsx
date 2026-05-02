import { ArrowDown, ArrowUp, Minus, Info, RotateCcw, Presentation, FileText, Table } from 'lucide-react';
import { KyoInsight, ProblemTag, MetricTag, TimeRange } from '@/types/kyo';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface InsightCardProps {
  insight: KyoInsight;
  onReset: () => void;
}

const problemLabels: Record<ProblemTag, string> = {
  quality: 'Quality',
  delivery: 'Delivery',
  pricing: 'Pricing',
  ux: 'UX',
  returns: 'Returns',
};

const metricLabels: Record<MetricTag, string> = {
  conversion: 'Conversion',
  roas: 'ROAS',
  sla: 'SLA',
  churn: 'Churn',
  returns: 'Returns',
};

const timeLabels: Record<TimeRange, string> = {
  '24h': '24 hours',
  '7d': '7 days',
  '30d': '30 days',
  'custom': 'Custom range',
};

export function InsightCard({ insight, onReset }: InsightCardProps) {
  const { toast } = useToast();

  const handleExport = (type: 'ppt' | 'doc' | 'table') => {
    const labels = { ppt: 'PPT', doc: 'Doc', table: 'Table' };
    toast({
      title: `Creating ${labels[type]}...`,
      description: 'Your export will be ready shortly.',
    });
  };

  const TrendIcon = insight.businessImpact.direction === 'up' 
    ? ArrowUp 
    : insight.businessImpact.direction === 'down' 
      ? ArrowDown 
      : Minus;

  return (
    <div className="space-y-3">
      {/* Main insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-3"
      >
        {/* Summary */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Summary</p>
          <p className="text-sm text-foreground leading-relaxed">{insight.summary}</p>
        </div>
        
        {/* Cause */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Cause / Themes</p>
          <p className="text-sm text-foreground leading-relaxed">{insight.cause}</p>
        </div>
        
        {/* Business Impact */}
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-muted-foreground">Business Impact:</p>
          <div className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
            insight.businessImpact.direction === 'down' 
              ? 'bg-destructive/10 text-destructive'
              : insight.businessImpact.direction === 'up'
                ? 'bg-success/10 text-success'
                : 'bg-muted text-muted-foreground'
          )}>
            <TrendIcon className="w-3 h-3" />
            {metricLabels[insight.businessImpact.metric]} {insight.businessImpact.value}
          </div>
        </div>
        
        {/* Suggested Action */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-1">Suggested Action</p>
          <p className="text-sm text-primary font-medium leading-relaxed">{insight.suggestedAction}</p>
        </div>
      </motion.div>
      
      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-warning/10 text-warning">
          {problemLabels[insight.problemTag]}
        </span>
        <span className="text-muted-foreground text-[10px]">→</span>
        <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
          {metricLabels[insight.metricTag]}
        </span>
      </div>
      
      {/* Data transparency */}
      <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground bg-muted/30 rounded-lg p-2">
        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Time range:</strong> {timeLabels[insight.timeRange]} · 
          <strong> Sources:</strong> {insight.sources.join(' + ')}
        </span>
      </div>
      
      {/* Export buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleExport('ppt')}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Presentation className="w-3.5 h-3.5" />
          Create PPT
        </button>
        <button
          onClick={() => handleExport('doc')}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-muted text-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          Create Doc
        </button>
        <button
          onClick={() => handleExport('table')}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-muted text-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
        >
          <Table className="w-3.5 h-3.5" />
          Create Table
        </button>
      </div>
      
      {/* Ask another */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        Ask another question
      </button>
    </div>
  );
}
