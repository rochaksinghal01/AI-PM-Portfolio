import { cn } from "@/lib/utils";
import { WizardStep } from "@/store/useResumeStore";

const steps: { key: WizardStep; label: string }[] = [
  { key: "input", label: "Job Details" },
  { key: "keywords", label: "Keywords & Upload" },
  { key: "result", label: "Results" },
];

const stepIndex = (step: WizardStep) => {
  if (step === "loading") return 0;
  return steps.findIndex((s) => s.key === step);
};

export const StepIndicator = ({ currentStep }: { currentStep: WizardStep }) => {
  const current = stepIndex(currentStep);

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full transition-colors duration-300",
                i <= current ? "bg-primary" : "bg-border"
              )}
            />
            <span
              className={cn(
                "text-sm transition-colors duration-300",
                i <= current ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-px w-8 transition-colors duration-300",
                i < current ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
