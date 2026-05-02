import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FeedbackLoop() {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [showReasonForm, setShowReasonForm] = useState(false);
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    if (type === 'negative') {
      setShowReasonForm(true);
    } else {
      setSubmitted(true);
    }
  };

  const handleSubmitReason = () => {
    setSubmitted(true);
    setShowReasonForm(false);
  };

  if (submitted) {
    return (
      <div className="bg-success/5 border border-success/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-card-foreground">Thanks for your feedback!</p>
            <p className="text-xs text-muted-foreground">
              Ask Kyo learns from your input to provide better insights over time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-card-foreground">Was this answer helpful?</span>
        </div>
        
        {!showReasonForm && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFeedback('positive')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all',
                feedback === 'positive'
                  ? 'bg-success/10 border-success/30 text-success'
                  : 'border-border hover:border-success/30 hover:bg-success/5 text-muted-foreground'
              )}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">Yes</span>
            </button>
            <button
              onClick={() => handleFeedback('negative')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all',
                feedback === 'negative'
                  ? 'bg-destructive/10 border-destructive/30 text-destructive'
                  : 'border-border hover:border-destructive/30 hover:bg-destructive/5 text-muted-foreground'
              )}
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="text-sm">No</span>
            </button>
          </div>
        )}
      </div>

      {showReasonForm && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-card-foreground">What could be improved?</p>
            <button
              onClick={() => setShowReasonForm(false)}
              className="text-muted-foreground hover:text-card-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {[
              'Answer was inaccurate',
              'Missing important context',
              'Confidence score too high',
              'Sources were outdated',
              'Other',
            ].map((option) => (
              <button
                key={option}
                onClick={() => setReason(option)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg border text-sm transition-all',
                  reason === option
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/30 text-muted-foreground'
                )}
              >
                {option}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleSubmitReason}
            disabled={!reason}
            className="mt-4 w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}
