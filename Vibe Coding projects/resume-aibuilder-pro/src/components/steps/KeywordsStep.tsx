import { useState, useRef } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Upload, FileText } from "lucide-react";

export const KeywordsStep = () => {
  const {
    jobTitle, keywords, addKeyword, removeKeyword,
    uploadedFile, setUploadedFile, setStep, setResult,
  } = useResumeStore();

  const [newKeyword, setNewKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addKeyword(newKeyword.trim());
      setNewKeyword("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    }
  };

  const handleGenerate = async () => {
    try {
      if (!uploadedFile) return;

      setIsGenerating(true);
      setStep("loading");

      const formData = new FormData();

      formData.append("stage", "approved");
      formData.append("job_title", jobTitle);

      // convert keywords to plain array
      const keywordList = keywords.map((k) => k.text);
      formData.append("keywords", JSON.stringify(keywordList));

      // OPTIONAL (if you later pass these from store)
      formData.append("about", "");
      formData.append("responsibilities", JSON.stringify([]));
      formData.append("requirements", JSON.stringify([]));
      formData.append("preferred_qualifications", JSON.stringify([]));

      // 🔥 THIS IS THE MOST IMPORTANT LINE
      formData.append("cv_file", uploadedFile);

      const res = await fetch(
        "https://rochak.app.n8n.cloud/webhook/job-application",
        {
          method: "POST",
          body: formData,
        }
      );

      const raw = await res.json();
      const data = raw.body || raw.data || raw;

      console.log("FINAL RESUME DATA:", data);

      setResult({
        optimizedResume: data.resume_preview
          ? `
${data.resume_preview.name || ""}
${data.resume_preview.headline || ""}
${data.resume_preview.summary || ""}
${(data.resume_preview.experience || []).join("\n")}
${(data.resume_preview.skills || []).join(", ")}
`
          : data.optimized_resume || data.resume || "",

        matchScore: Math.round(
          data.scores?.after ||
          data.match_score ||
          data.score ||
          data.scores?.improvement ||
          0
        ),

        improvements:
          data.highlights?.top_changes ||
          data.improvements ||
          [
            "ATS optimized",
            "Keywords added",
            "Stronger bullet points",
            "Improved formatting"
          ]
      });

      setStep("result");
    } catch (err) {
      console.error("Generate error:", err);
      setStep("keywords");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Extracted job title</p>
        <h1 className="text-2xl font-semibold tracking-tight">{jobTitle}</h1>
      </div>

      {/* Keywords */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Keywords
        </h2>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span
              key={kw.id}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
            >
              {kw.text}
              <button
                onClick={() => removeKeyword(kw.id)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a keyword..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleAddKeyword} disabled={!newKeyword.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Your Resume
        </h2>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        {uploadedFile ? (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-4">
            <FileText className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm font-medium truncate flex-1">{uploadedFile.name}</span>
            <button
              onClick={() => setUploadedFile(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-lg border-2 border-dashed border-border p-8 text-center hover:border-primary/50 hover:bg-secondary/50 transition-colors"
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Click to upload your resume</p>
            <p className="text-xs text-muted-foreground mt-1">PDF only</p>
          </button>
        )}
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!uploadedFile || isGenerating}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            Generating...
          </span>
        ) : (
          "Generate Optimized Resume"
        )}
      </Button>
    </div>
  );
};
