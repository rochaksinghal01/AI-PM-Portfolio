import { useResumeStore } from "@/store/useResumeStore";
import { StepIndicator } from "@/components/StepIndicator";
import { JobInputStep } from "@/components/steps/JobInputStep";
import { LoadingStep } from "@/components/steps/LoadingStep";
import { KeywordsStep } from "@/components/steps/KeywordsStep";
import { ResultStep } from "@/components/steps/ResultStep";
import { FileText } from "lucide-react";

const Index = () => {
  const step = useResumeStore((s) => s.step);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold tracking-tight">ResumeAI</span>
          </div>
          <StepIndicator currentStep={step} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        {step === "input" && <JobInputStep />}
        {step === "loading" && <LoadingStep />}
        {step === "keywords" && <KeywordsStep />}
        {step === "result" && <ResultStep />}
      </main>
    </div>
  );
};

export default Index;
