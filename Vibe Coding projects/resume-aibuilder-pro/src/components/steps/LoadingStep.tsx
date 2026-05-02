import { Loader2 } from "lucide-react";

export const LoadingStep = () => {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-24 space-y-6">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <div className="text-center space-y-1">
        <p className="text-lg font-medium">Analyzing job & extracting keywords...</p>
        <p className="text-sm text-muted-foreground">This usually takes a few seconds</p>
      </div>
    </div>
  );
};
