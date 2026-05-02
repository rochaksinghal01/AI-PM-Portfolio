import { create } from "zustand";

export type WizardStep = "input" | "loading" | "keywords" | "result";

interface Keyword {
  id: string;
  text: string;
}

interface ResumeState {
  step: WizardStep;
  jobLink: string;
  jobDescription: string;
  jobTitle: string;
  keywords: Keyword[];
  uploadedFile: File | null;
  matchScore: number;
  improvements: string[];
  optimizedResume: string;

  setStep: (step: WizardStep) => void;
  setJobLink: (link: string) => void;
  setJobDescription: (desc: string) => void;
  setJobTitle: (title: string) => void;
  setKeywords: (keywords: Keyword[]) => void;
  addKeyword: (text: string) => void;
  removeKeyword: (id: string) => void;
  setUploadedFile: (file: File | null) => void;
  setResult: (data: any) => void;
  reset: () => void;
}

const initialState = {
  step: "input" as WizardStep,
  jobLink: "",
  jobDescription: "",
  jobTitle: "",
  keywords: [] as Keyword[],
  uploadedFile: null as File | null,
  matchScore: 0,
  improvements: [] as string[],
  optimizedResume: "",
};

export const useResumeStore = create<ResumeState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setJobLink: (jobLink) => set({ jobLink }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setJobTitle: (jobTitle) => set({ jobTitle }),
  setKeywords: (keywords) => set({ keywords }),
  addKeyword: (text) =>
    set((state) => ({
      keywords: [...state.keywords, { id: crypto.randomUUID(), text }],
    })),
  removeKeyword: (id) =>
    set((state) => ({
      keywords: state.keywords.filter((k) => k.id !== id),
    })),
  setUploadedFile: (uploadedFile) => set({ uploadedFile }),
  setResult: (data: any) =>
    set({ matchScore: data.matchScore ?? data.match_score ?? 0, improvements: data.improvements ?? [], optimizedResume: data.optimizedResume ?? data.optimized_resume ?? "" }),
  reset: () => set(initialState),
}));
