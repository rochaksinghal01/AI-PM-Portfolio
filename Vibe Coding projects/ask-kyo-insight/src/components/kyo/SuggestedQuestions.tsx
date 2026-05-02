import { Sparkles } from 'lucide-react';
import { QuickQuestion } from '@/types/kyo';
import { motion } from 'framer-motion';

interface SuggestedQuestionsProps {
  questions: QuickQuestion[];
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">Suggested for you</span>
      </div>
      
      <div className="space-y-2">
        {questions.slice(0, 5).map((q, index) => (
          <motion.button
            key={q.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(q.question)}
            className="w-full group text-left p-3 rounded-xl bg-muted/40 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
          >
            <p className="text-sm text-card-foreground group-hover:text-primary transition-colors leading-relaxed">
              {q.question}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
