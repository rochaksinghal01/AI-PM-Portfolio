import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2 } from 'lucide-react';
import { CallInputForm } from '@/components/call-evaluation/CallInputForm';
import { EvaluationResults } from '@/components/call-evaluation/EvaluationResults';
import { CallEvaluationResult, CallType, CustomerType } from '@/types/callEvaluation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function CallEvaluation() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CallEvaluationResult | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (transcript: string, callType: CallType, customerType: CustomerType) => {
    setIsLoading(true);
    setCurrentTranscript(transcript);

    try {
      const { data, error } = await supabase.functions.invoke('evaluate-call', {
        body: { transcript, callType, customerType },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast({
        title: 'Evaluation Complete',
        description: 'Your call has been successfully analyzed.',
      });

      // Store in local storage for dashboard
      const storedCalls = JSON.parse(localStorage.getItem('evaluatedCalls') || '[]');
      storedCalls.unshift({
        ...data,
        id: data.call_metadata?.call_id || `CALL${Date.now()}`,
        evaluatedAt: new Date().toISOString(),
        transcript,
      });
      localStorage.setItem('evaluatedCalls', JSON.stringify(storedCalls.slice(0, 100)));
    } catch (error) {
      console.error('Evaluation error:', error);
      toast({
        title: 'Evaluation Failed',
        description: error instanceof Error ? error.message : 'An error occurred during evaluation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Call Evaluation</h1>
          </div>
          <p className="text-muted-foreground">
            Upload a call transcript to receive AI-powered quality analysis and insights.
          </p>
        </motion.div>

        {/* Content */}
        {result ? (
          <EvaluationResults
            result={result}
            transcript={currentTranscript}
            onBack={handleBack}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl border border-border/50 p-6"
          >
            <CallInputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
