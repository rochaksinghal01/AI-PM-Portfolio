import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  MessageSquare,
  Clock,
  Heart,
  Flag,
  Download,
  FileText,
  FileSpreadsheet,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CallEvaluationResult, TranscriptLine } from '@/types/callEvaluation';
import { parseTranscript } from '@/data/callEvaluationMock';

interface EvaluationResultsProps {
  result: CallEvaluationResult;
  transcript: string;
  onBack: () => void;
}

function ScoreGauge({ score, maxScore, label }: { score: number; maxScore: number; label: string }) {
  const percentage = (score / maxScore) * 100;
  const color = percentage >= 80 ? 'text-green-500' : percentage >= 60 ? 'text-yellow-500' : 'text-red-500';
  
  return (
    <div className="text-center">
      <div className={cn("text-2xl font-bold", color)}>
        {score.toFixed(1)}
      </div>
      <div className="text-xs text-muted-foreground">/{maxScore}</div>
      <div className="text-xs font-medium mt-1">{label}</div>
    </div>
  );
}

function DimensionCard({
  title,
  icon: Icon,
  score,
  maxScore,
  children,
  alerts,
}: {
  title: string;
  icon: React.ElementType;
  score: number;
  maxScore: number;
  children: React.ReactNode;
  alerts: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const percentage = (score / maxScore) * 100;
  
  return (
    <motion.div
      className="border border-border/50 rounded-xl overflow-hidden bg-card/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-accent/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            percentage >= 80 ? "bg-green-500/10 text-green-500" :
            percentage >= 60 ? "bg-yellow-500/10 text-yellow-500" :
            "bg-red-500/10 text-red-500"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="font-medium">{title}</div>
            <div className="text-sm text-muted-foreground">
              Score: {score.toFixed(2)} / {maxScore}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {alerts.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {alerts.length} Alert{alerts.length > 1 ? 's' : ''}
            </Badge>
          )}
          <Progress value={percentage} className="w-24 h-2" />
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50"
          >
            <div className="p-4 space-y-3 text-sm">
              {children}
              {alerts.length > 0 && (
                <div className="mt-3 p-3 bg-destructive/10 rounded-lg">
                  <div className="font-medium text-destructive mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Alerts
                  </div>
                  {alerts.map((alert, i) => (
                    <div key={i} className="text-destructive/80 text-xs">{alert}</div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LabelBadge({ label, positive }: { label: string; positive?: boolean }) {
  const isPositive = positive ?? ['clear', 'correct', 'pass', 'present', 'warm', 'aligned', 'good', 'structured', 'appropriate', 'acceptable', 'high', 'confirmed', 'proper'].includes(label.toLowerCase());
  
  return (
    <Badge variant={isPositive ? "default" : "secondary"} className="text-xs capitalize">
      {isPositive ? <CheckCircle2 className="w-3 h-3 mr-1" /> : null}
      {label}
    </Badge>
  );
}

function TranscriptViewer({ lines }: { lines: TranscriptLine[] }) {
  return (
    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: line.speaker === 'Agent' ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.02 }}
          className={cn(
            "p-3 rounded-lg text-sm",
            line.speaker === 'Agent'
              ? "bg-primary/10 ml-0 mr-8"
              : "bg-muted/50 ml-8 mr-0"
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{line.timestamp}</span>
            <span className={cn(
              "text-xs font-medium",
              line.speaker === 'Agent' ? "text-primary" : "text-foreground"
            )}>
              {line.speaker}
            </span>
          </div>
          <p className="text-foreground/90">{line.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function EvaluationResults({ result, transcript, onBack }: EvaluationResultsProps) {
  const transcriptLines = parseTranscript(transcript);
  const d1 = result.dimension_1_understanding_accuracy_compliance;
  const d2 = result.dimension_2_communication_clarity;
  const d3 = result.dimension_3_responsiveness_efficiency;
  const d4 = result.dimension_4_emotional_intelligence;
  const d5 = result.dimension_5_resolution_closure;
  const classification = result.classification_and_tagging;

  const handleExport = (type: 'json' | 'pdf' | 'csv') => {
    if (type === 'json') {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `call-evaluation-${result.call_metadata.call_id}.json`;
      a.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Input
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button variant="outline" size="sm" disabled>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Success Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3"
      >
        <CheckCircle2 className="w-6 h-6 text-green-500" />
        <div>
          <div className="font-medium text-green-600">Your call has been analyzed ✔️</div>
          <div className="text-sm text-muted-foreground">
            Call ID: {result.call_metadata.call_id} • Duration: {Math.floor((result.call_metadata.duration_seconds || 0) / 60)}m {(result.call_metadata.duration_seconds || 0) % 60}s
          </div>
        </div>
      </motion.div>

      {/* Call Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 bg-card rounded-2xl border border-border/50 space-y-4"
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Call Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Primary Topic</div>
              <Badge variant="outline" className="capitalize">
                {classification.primary_topic?.replace(/_/g, ' ') || 'N/A'}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Intent</div>
              <Badge variant="outline" className="capitalize">
                {classification.primary_intent?.replace(/_/g, ' ') || 'N/A'}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Root Cause</div>
              <Badge variant="outline" className="capitalize">
                {classification.root_causes?.[0]?.cause?.replace(/_/g, ' ') || 'N/A'}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Emotion Shift</div>
              <Badge variant={d4.emotion_shift === 'improved' ? 'default' : d4.emotion_shift === 'worsened' ? 'destructive' : 'secondary'}>
                {d4.emotion_shift === 'improved' ? <TrendingUp className="w-3 h-3 mr-1" /> : d4.emotion_shift === 'worsened' ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                {d4.customer_emotion_start} → {d4.customer_emotion_end}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-xs text-muted-foreground mb-2">Summary</div>
            <p className="text-sm">{result.summary?.one_line_summary || 'No summary available'}</p>
          </div>

          {(result.global_alerts?.length > 0 || classification.escalation_triggered) && (
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <div className="font-medium text-yellow-600 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Alerts & Escalations
              </div>
              {classification.escalation_triggered && (
                <div className="text-sm text-yellow-600/80 mb-1">
                  • Escalation Triggered: {classification.escalation_reason}
                </div>
              )}
              {result.global_alerts?.map((alert, i) => (
                <div key={i} className="text-sm text-yellow-600/80">• {alert}</div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-card rounded-2xl border border-border/50 flex flex-col items-center justify-center"
        >
          <div className="text-sm text-muted-foreground mb-2">Overall Score</div>
          <div className={cn(
            "text-5xl font-bold",
            result.weighted_overall_score >= 80 ? "text-green-500" :
            result.weighted_overall_score >= 60 ? "text-yellow-500" :
            "text-red-500"
          )}>
            {result.weighted_overall_score?.toFixed(1) || 'N/A'}
          </div>
          <div className="text-sm text-muted-foreground mt-1">/ 100</div>
          <Progress value={result.weighted_overall_score || 0} className="w-full h-3 mt-4" />
        </motion.div>
      </div>

      {/* Team Routing Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 bg-card rounded-2xl border border-border/50 space-y-4"
      >
        <h3 className="font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Team Routing
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classification.team_assignments?.map((team, i) => (
            <div key={i} className={cn(
              "p-3 rounded-lg border",
              team.role === 'primary_owner' ? "border-primary/50 bg-primary/5" :
              team.role === 'secondary_owner' ? "border-secondary/50 bg-secondary/5" :
              "border-border/50"
            )}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{team.team_name}</span>
                <Badge variant={team.role === 'primary_owner' ? 'default' : 'secondary'} className="text-xs capitalize">
                  {team.role.replace(/_/g, ' ')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{team.reason}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dimension Cards */}
      <div className="space-y-3">
        <h3 className="font-semibold">Detailed Evaluation</h3>
        
        <DimensionCard
          title="D1: Understanding, Accuracy & Compliance"
          icon={Target}
          score={d1.score}
          maxScore={35}
          alerts={d1.alerts || []}
        >
          <div className="grid grid-cols-2 gap-3">
            <div><span className="text-muted-foreground">Problem Capture:</span> <LabelBadge label={d1.problem_capture?.label || 'N/A'} /></div>
            <div><span className="text-muted-foreground">Accuracy:</span> <LabelBadge label={d1.information_accuracy?.label || 'N/A'} /></div>
            <div><span className="text-muted-foreground">Compliance:</span> <LabelBadge label={d1.compliance?.label || 'N/A'} /></div>
            <div><span className="text-muted-foreground">Routing:</span> <LabelBadge label={d1.routing_alignment?.label || 'N/A'} /></div>
          </div>
        </DimensionCard>

        <DimensionCard
          title="D2: Communication Clarity"
          icon={MessageSquare}
          score={d2.score}
          maxScore={20}
          alerts={d2.alerts || []}
        >
          <div className="grid grid-cols-2 gap-3">
            <div><span className="text-muted-foreground">Greeting:</span> <LabelBadge label={d2.greeting?.label || 'N/A'} /> <span className="text-xs">({d2.greeting?.tone})</span></div>
            <div><span className="text-muted-foreground">Clarity:</span> <LabelBadge label={d2.speech_clarity?.label || 'N/A'} /></div>
            <div><span className="text-muted-foreground">Listening:</span> <LabelBadge label={d2.listening?.label || 'N/A'} /></div>
            <div><span className="text-muted-foreground">Structure:</span> <LabelBadge label={d2.explanation_structure?.label || 'N/A'} /></div>
          </div>
        </DimensionCard>

        <DimensionCard
          title="D3: Responsiveness & Efficiency"
          icon={Clock}
          score={d3.score}
          maxScore={15}
          alerts={d3.alerts || []}
        >
          <div className="grid grid-cols-2 gap-3">
            <div><span className="text-muted-foreground">Avg Response:</span> {d3.response_latency?.average_turn_delay_sec || 0}s</div>
            <div><span className="text-muted-foreground">Hold Handling:</span> <LabelBadge label={d3.hold_handling?.label || 'N/A'} /></div>
            <div><span className="text-muted-foreground">Dead Air:</span> <LabelBadge label={d3.dead_air?.label || 'N/A'} /></div>
            <div><span className="text-muted-foreground">Notes:</span> {d3.efficiency_notes || 'None'}</div>
          </div>
        </DimensionCard>

        <DimensionCard
          title="D4: Emotional Intelligence"
          icon={Heart}
          score={d4.score}
          maxScore={15}
          alerts={d4.alerts || []}
        >
          <div className="grid grid-cols-2 gap-3">
            <div><span className="text-muted-foreground">Emotion Shift:</span> <LabelBadge label={d4.emotion_shift || 'N/A'} positive={d4.emotion_shift === 'improved'} /></div>
            <div><span className="text-muted-foreground">Patience:</span> <LabelBadge label={d4.agent_patience_level?.label || 'N/A'} /></div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Empathy Phrases:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {d4.empathy_markers?.phrases?.map((phrase, i) => (
                  <Badge key={i} variant="outline" className="text-xs">"{phrase}"</Badge>
                )) || <span className="text-xs text-muted-foreground">None detected</span>}
              </div>
            </div>
          </div>
        </DimensionCard>

        <DimensionCard
          title="D5: Resolution & Closure"
          icon={Flag}
          score={d5.score}
          maxScore={15}
          alerts={d5.alerts || []}
        >
          <div className="grid grid-cols-2 gap-3">
            <div><span className="text-muted-foreground">Solution:</span> <LabelBadge label={d5.solution_correctness?.label || 'N/A'} /></div>
            <div><span className="text-muted-foreground">Next Steps:</span> <LabelBadge label={d5.next_steps_clarity?.label || 'N/A'} /></div>
            <div><span className="text-muted-foreground">Confirmation:</span> <LabelBadge label={d5.customer_confirmation?.label || 'N/A'} /></div>
            <div><span className="text-muted-foreground">Closure:</span> <LabelBadge label={d5.closure_quality?.label || 'N/A'} /></div>
          </div>
        </DimensionCard>
      </div>

      {/* Transcript Viewer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-card rounded-2xl border border-border/50 space-y-4"
      >
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Transcript
        </h3>
        <TranscriptViewer lines={transcriptLines} />
      </motion.div>
    </motion.div>
  );
}
