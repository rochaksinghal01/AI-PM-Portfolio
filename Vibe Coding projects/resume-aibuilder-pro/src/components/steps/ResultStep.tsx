import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";

// Safely stringify any value into clean human-readable text
const valueToText = (val: any): string => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) return val.map(valueToText).filter(Boolean).join(", ");
  if (typeof val === "object") {
    return Object.entries(val)
      .filter(([, v]) => v !== null && v !== undefined && v !== "")
      .map(([k, v]) => `${k}: ${valueToText(v)}`)
      .join(" • ");
  }
  return "";
};

const formatExperience = (exp: any): string => {
  if (typeof exp === "string") return `• ${exp}`;
  if (!exp || typeof exp !== "object") return "";

  const title = exp.title || exp.role || exp.position || "";
  const company = exp.company || exp.employer || exp.organization || "";
  const dates = exp.dates || exp.duration || [exp.start, exp.end].filter(Boolean).join(" - ");
  const location = exp.location || "";

  const header = [title, company].filter(Boolean).join(" @ ");
  const meta = [dates, location].filter(Boolean).join(" | ");

  const bullets: string[] = [];
  const points = exp.bullets || exp.highlights || exp.description || exp.responsibilities;
  if (Array.isArray(points)) {
    points.forEach((p) => bullets.push(`  - ${valueToText(p)}`));
  } else if (typeof points === "string") {
    bullets.push(`  - ${points}`);
  }

  return [header, meta, ...bullets].filter(Boolean).join("\n");
};

const formatProject = (p: any): string => {
  if (typeof p === "string") return `• ${p}`;
  if (!p || typeof p !== "object") return "";
  const name = p.name || p.title || "";
  const desc = p.description || p.summary || "";
  const tech = Array.isArray(p.tech) ? p.tech.join(", ") : p.tech || p.stack || "";
  const link = p.link || p.url || "";
  return [name && `• ${name}`, desc && `  ${desc}`, tech && `  Tech: ${tech}`, link && `  ${link}`]
    .filter(Boolean)
    .join("\n");
};

const formatSkill = (s: any): string => {
  if (typeof s === "string") return s;
  if (!s || typeof s !== "object") return "";
  if (s.name && s.items) return `${s.name}: ${valueToText(s.items)}`;
  if (s.category && s.skills) return `${s.category}: ${valueToText(s.skills)}`;
  return valueToText(s);
};

const buildResumeText = (resume: any): string => {
  if (!resume || typeof resume !== "object") return typeof resume === "string" ? resume : "";

  const sections: string[] = [];

  // Header
  if (resume.name) sections.push(resume.name.toUpperCase());
  if (resume.headline || resume.title) sections.push(resume.headline || resume.title);

  const contact = [resume.email, resume.phone, resume.location, resume.linkedin, resume.website]
    .filter(Boolean)
    .join(" | ");
  if (contact) sections.push(contact);

  // Summary
  if (resume.summary || resume.objective) {
    sections.push("\nSUMMARY\n" + "─".repeat(40));
    sections.push(resume.summary || resume.objective);
  }

  // Experience
  const experience = resume.experience || resume.work_experience;
  if (Array.isArray(experience) && experience.length > 0) {
    sections.push("\nEXPERIENCE\n" + "─".repeat(40));
    sections.push(experience.map(formatExperience).filter(Boolean).join("\n\n"));
  }

  // Projects
  if (Array.isArray(resume.projects) && resume.projects.length > 0) {
    sections.push("\nPROJECTS\n" + "─".repeat(40));
    sections.push(resume.projects.map(formatProject).filter(Boolean).join("\n\n"));
  }

  // Education
  const education = resume.education;
  if (Array.isArray(education) && education.length > 0) {
    sections.push("\nEDUCATION\n" + "─".repeat(40));
    sections.push(
      education
        .map((e: any) => {
          if (typeof e === "string") return `• ${e}`;
          const degree = e.degree || e.qualification || "";
          const school = e.school || e.institution || e.university || "";
          const year = e.year || e.dates || [e.start, e.end].filter(Boolean).join(" - ");
          return [degree, school, year].filter(Boolean).join(" | ");
        })
        .filter(Boolean)
        .join("\n")
    );
  }

  // Skills
  if (Array.isArray(resume.skills) && resume.skills.length > 0) {
    sections.push("\nSKILLS\n" + "─".repeat(40));
    sections.push(resume.skills.map(formatSkill).filter(Boolean).join("\n"));
  } else if (resume.skills && typeof resume.skills === "object") {
    sections.push("\nSKILLS\n" + "─".repeat(40));
    sections.push(valueToText(resume.skills));
  }

  // Certifications
  if (Array.isArray(resume.certifications) && resume.certifications.length > 0) {
    sections.push("\nCERTIFICATIONS\n" + "─".repeat(40));
    sections.push(resume.certifications.map((c: any) => `• ${valueToText(c)}`).join("\n"));
  }

  return sections.join("\n");
};

export const ResultStep = () => {
  const { matchScore, improvements, optimizedResume, reset } = useResumeStore();

  // Normalize: optimizedResume may be a JSON string of resume_preview, plain text, or empty
  const formattedResume = useMemo(() => {
    if (!optimizedResume) return "";
    // Try to parse JSON; if it's an object, format it. Otherwise treat as text.
    try {
      const parsed = JSON.parse(optimizedResume);
      if (parsed && typeof parsed === "object") {
        const built = buildResumeText(parsed);
        return built || optimizedResume;
      }
    } catch {
      // not JSON — keep as-is
    }
    return optimizedResume;
  }, [optimizedResume]);

  const safeScore = Number.isFinite(matchScore) ? Math.round(matchScore) : 0;

  const handleDownload = () => {
    const blob = new Blob([formattedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized-resume.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your optimized resume</h1>
          <p className="mt-1 text-muted-foreground">Review the changes and download when ready.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 shrink-0">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <span className="text-lg font-bold text-success">{safeScore}%</span>
          <span className="text-sm text-success/80">match</span>
        </div>
      </div>

      {/* Improvements */}
      {improvements && improvements.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Key Improvements
          </h2>
          <ul className="space-y-2">
            {improvements.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{typeof item === "string" ? item : valueToText(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Resume Preview */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Resume Preview
        </h2>
        <div className="rounded-lg border border-border bg-card p-6 text-sm leading-7 whitespace-pre-wrap font-sans text-foreground">
          {formattedResume || (
            <span className="text-muted-foreground italic">No resume content available.</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleDownload} className="flex-1 h-12 text-base font-medium" size="lg">
          <Download className="h-4 w-4 mr-2" />
          Download Resume
        </Button>
        <Button variant="outline" onClick={reset} className="h-12 text-base font-medium" size="lg">
          <RotateCcw className="h-4 w-4 mr-2" />
          Start Over
        </Button>
      </div>
    </div>
  );
};
