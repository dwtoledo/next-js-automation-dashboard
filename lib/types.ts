import prisma from './prisma';

export type JobAnalysis = Awaited<ReturnType<typeof prisma.jobAnalysis.findFirst>>;

export interface FilterOption {
  value: string;
  label: string;
  color: string;
}

export interface JobAnalysisRow {
  id: string;
  jobId: string;
  jobUrl: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  isApplied: boolean;
  hasEasyApply: boolean;
  overallCompatibility: number;
  manualStatus: string;
  manualDecisionAt: Date | null;
  manualNotes: string | null;
  recruiterUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  experienceRequired?: string;
  seniorityLevel?: string;
  iaRecommendation?: string;
}
