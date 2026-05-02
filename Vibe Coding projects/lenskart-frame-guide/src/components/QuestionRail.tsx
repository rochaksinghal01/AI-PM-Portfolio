import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionRailProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  onAskQuestion: () => void;
}

export const QuestionRail = ({ questions, onQuestionClick, onAskQuestion }: QuestionRailProps) => {
  return (
    <div className="w-full px-4">
      <h4 className="text-sm font-semibold text-foreground mb-3">Common Questions</h4>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium",
              "bg-card border border-border text-foreground",
              "hover:bg-secondary transition-colors"
            )}
          >
            {question}
          </button>
        ))}
        <button
          onClick={onAskQuestion}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            "flex items-center gap-2"
          )}
        >
          Ask a Question
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
