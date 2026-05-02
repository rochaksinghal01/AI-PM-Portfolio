import { cn } from "@/lib/utils";
import { User, Headphones } from "lucide-react";

interface TranscriptLine {
  time: string;
  speaker: string;
  text: string;
}

interface TranscriptViewerProps {
  transcript: TranscriptLine[];
  empathyPhrases?: string[];
  complianceIssues?: string[];
}

export function TranscriptViewer({ transcript, empathyPhrases = [], complianceIssues = [] }: TranscriptViewerProps) {
  const highlightText = (text: string) => {
    let result = text;
    
    // Highlight empathy phrases
    empathyPhrases.forEach(phrase => {
      const regex = new RegExp(`(${phrase})`, "gi");
      result = result.replace(regex, '<span class="highlight-empathy">$1</span>');
    });

    return result;
  };

  return (
    <div className="dashboard-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Transcript</h3>
          <p className="text-sm text-muted-foreground mt-1">Call recording with highlights</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-success/50" />
            Empathy
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-destructive/50" />
            Compliance
          </div>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto rounded-lg border border-border">
        {transcript.map((line, index) => {
          const isAgent = line.speaker.toLowerCase() === "agent";
          
          return (
            <div
              key={index}
              className={cn(
                "transcript-line",
                isAgent ? "transcript-line-agent" : "transcript-line-customer"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                    isAgent ? "bg-primary/20" : "bg-accent/20"
                  )}
                >
                  {isAgent ? (
                    <Headphones className={cn("h-3.5 w-3.5", "text-primary")} />
                  ) : (
                    <User className={cn("h-3.5 w-3.5", "text-accent")} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground">{line.speaker}</span>
                    <span className="text-xs text-muted-foreground">{line.time}</span>
                  </div>
                  <p
                    className="text-sm text-foreground/90 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightText(line.text) }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
