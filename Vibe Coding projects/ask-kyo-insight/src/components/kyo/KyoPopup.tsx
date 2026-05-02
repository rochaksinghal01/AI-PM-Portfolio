import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserContext, QuickQuestion, TimeRange, KyoInsight } from '@/types/kyo';
import { PopupHeader } from './PopupHeader';
import { TimeRangeSelector } from './TimeRangeSelector';
import { SuggestedQuestions } from './SuggestedQuestions';
import { PopupInput } from './PopupInput';
import { InsightCard } from './InsightCard';
import { sampleInsight } from '@/data/mockData';

interface KyoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserContext;
  questions: QuickQuestion[];
}

export function KyoPopup({ isOpen, onClose, user, questions }: KyoPopupProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [insight, setInsight] = useState<KyoInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = (question: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setInsight({ ...sampleInsight, timeRange });
      setIsLoading(false);
    }, 1200);
  };

  const handleReset = () => {
    setInsight(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/5 backdrop-blur-[2px]"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className={cn(
              'fixed bottom-24 right-6 z-50',
              'w-[380px] max-h-[calc(100vh-120px)]',
              'bg-card rounded-2xl shadow-2xl',
              'border border-border/50',
              'overflow-hidden flex flex-col'
            )}
          >
            {/* Header */}
            <PopupHeader user={user} onClose={onClose} />
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Time Range */}
              <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
              
              {/* Loading State */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-center justify-center"
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="mt-3 text-sm text-muted-foreground">Analyzing data...</p>
                  </motion.div>
                ) : insight ? (
                  <motion.div
                    key="insight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <InsightCard insight={insight} onReset={handleReset} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="questions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SuggestedQuestions questions={questions} onSelect={handleAsk} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Input */}
            <PopupInput onSubmit={handleAsk} isLoading={isLoading} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
