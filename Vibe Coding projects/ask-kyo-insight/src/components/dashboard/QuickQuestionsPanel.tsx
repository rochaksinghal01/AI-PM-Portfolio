import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { QuickQuestion } from '@/types/kyo';
import { cn } from '@/lib/utils';

interface QuickQuestionsPanelProps {
  questions: QuickQuestion[];
  teamName: string;
  onAsk: (question: string) => void;
}

export function QuickQuestionsPanel({ questions, teamName, onAsk }: QuickQuestionsPanelProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-card-foreground">
            Top Questions for {teamName}
          </h3>
        </div>
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => onAsk(q.question)}
            className="w-full group flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all text-left"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-card-foreground group-hover:text-primary transition-colors">
                {q.question}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {q.category}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {q.popularity}% of team asks this
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
