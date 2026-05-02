import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TranscriptInput } from "@/components/evaluation/TranscriptInput";
import { CallSummaryCard } from "@/components/evaluation/CallSummaryCard";
import { TeamRoutingCard } from "@/components/evaluation/TeamRoutingCard";
import { DimensionCard } from "@/components/evaluation/DimensionCard";
import { TranscriptViewer } from "@/components/evaluation/TranscriptViewer";
import { ExportButtons } from "@/components/evaluation/ExportButtons";
import { mockEvaluationResult, mockTranscript } from "@/lib/mockData";
import { CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function CallEvaluation() {
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (transcript: string, callType: string, customerType: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Use mock data for prototype
    setEvaluationResult(mockEvaluationResult);
    setIsLoading(false);
    
    toast({
      title: "Call Evaluated Successfully",
      description: "Your call has been analyzed and scored.",
    });
  };

  const dimensions = evaluationResult ? [
    {
      title: "D1: Understanding, Accuracy & Compliance",
      description: "Problem capture, information accuracy, and compliance verification",
      score: evaluationResult.dimension_1_understanding_accuracy_compliance.score,
      maxScore: 35,
      data: evaluationResult.dimension_1_understanding_accuracy_compliance,
    },
    {
      title: "D2: Communication Clarity",
      description: "Greeting, language alignment, speech clarity, and structure",
      score: evaluationResult.dimension_2_communication_clarity.score,
      maxScore: 20,
      data: evaluationResult.dimension_2_communication_clarity,
    },
    {
      title: "D3: Responsiveness & Efficiency",
      description: "Response latency, hold handling, and dead air management",
      score: evaluationResult.dimension_3_responsiveness_efficiency.score,
      maxScore: 15,
      data: evaluationResult.dimension_3_responsiveness_efficiency,
    },
    {
      title: "D4: Emotional Intelligence",
      description: "Emotion shift, empathy markers, and de-escalation",
      score: evaluationResult.dimension_4_emotional_intelligence.score,
      maxScore: 15,
      data: evaluationResult.dimension_4_emotional_intelligence,
    },
    {
      title: "D5: Resolution & Closure",
      description: "Solution correctness, next steps, and closure quality",
      score: evaluationResult.dimension_5_resolution_closure.score,
      maxScore: 15,
      data: evaluationResult.dimension_5_resolution_closure,
    },
  ] : [];

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Call Evaluation</h1>
          <p className="text-muted-foreground mt-1">
            Submit a call transcript for quality analysis
          </p>
        </div>

        {/* Input Section */}
        <TranscriptInput onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Results Section */}
        {evaluationResult && (
          <div className="mt-8 space-y-6">
            {/* Success Banner */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Evaluation Complete</p>
                  <p className="text-sm text-muted-foreground">
                    Call {evaluationResult.call_metadata.call_id} has been analyzed
                  </p>
                </div>
              </div>
              <ExportButtons data={evaluationResult} />
            </div>

            {/* Summary & Routing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CallSummaryCard data={evaluationResult} />
              <TeamRoutingCard data={evaluationResult} />
            </div>

            {/* Dimension Cards */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Quality Dimensions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dimensions.map((dim, index) => (
                  <DimensionCard
                    key={dim.title}
                    {...dim}
                    delay={0.2 + index * 0.05}
                  />
                ))}
              </div>
            </div>

            {/* Transcript Viewer */}
            <TranscriptViewer
              transcript={mockTranscript}
              empathyPhrases={evaluationResult.dimension_4_emotional_intelligence.empathy_markers?.phrases || []}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
