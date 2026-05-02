import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, FileText } from "lucide-react";

export const JobInputStep = () => {
  const { jobLink, jobDescription, setJobLink, setJobDescription, setStep, setJobTitle, setKeywords } =
    useResumeStore();
  const [mode, setMode] = useState<"link" | "paste">("link");

  const canProceed = mode === "link" ? jobLink.trim().length > 0 : jobDescription.trim().length > 0;

  const handleOptimize = async () => {
    try {
      setStep("loading");

      const res = await fetch("https://rochak.app.n8n.cloud/webhook/job-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stage: "start",
          job_link: mode === "link" ? jobLink : "",
          manual_jd: mode === "paste" ? jobDescription : "",
        }),
      });

      const raw = await res.json();

      const item = Array.isArray(raw) ? raw[0] : raw;
      const data = item.jd_structured || item.body || item;
      console.log("FINAL DATA:", data);
      setJobTitle(data.job_title || "");
      const formattedKeywords = (data.keywords || []).map((text: string) => ({
        id: crypto.randomUUID(),
        text,
      }));
      setKeywords(formattedKeywords);
      setStep("keywords");
    } catch (err) {
      console.error("API Error:", err);
      setStep("input");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Paste a job posting
        </h1>
        <p className="mt-1 text-muted-foreground">
          We'll extract keywords and tailor your resume to match.
        </p>
      </div>

      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        <button
          onClick={() => setMode("link")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "link"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Link className="h-4 w-4" />
          Job Link
        </button>
        <button
          onClick={() => setMode("paste")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "paste"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          Paste Description
        </button>
      </div>

      {mode === "link" ? (
        <Input
          placeholder="https://jobs.example.com/senior-engineer"
          value={jobLink}
          onChange={(e) => setJobLink(e.target.value)}
          className="h-12"
        />
      ) : (
        <Textarea
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[200px] resize-none"
        />
      )}

      <Button
        onClick={handleOptimize}
        disabled={!canProceed}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        Optimize Resume
      </Button>
    </div>
  );
};
