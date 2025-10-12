import type { JobAnalysis as PrismaJobAnalysis, ManualStatus } from '@prisma/client';
export type { JobAnalysis, ManualStatus } from '@prisma/client';

export type JobAnalysisNonNull = NonNullable<PrismaJobAnalysis>;

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
  manualStatus: ManualStatus;
  manualDecisionAt: Date | null;
  manualNotes: string | null;
  recruiterUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  experienceRequired?: string;
  seniorityLevel?: string;
  iaRecommendation?: string;
}

export interface JobAnalysisSearchParams {
  search?: string;
  hasEasyApply?: boolean;
  manualStatus?: string;
  seniority?: string;
  iaRecommendation?: string;
  minCompatibility?: string;
  maxCompatibility?: string;
  minExperience?: string;
  maxExperience?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}

export interface ExperienceRequirements {
  minimumYears?: number;
  seniorityLevel?: string;
  inferenceSource?: string;
}

export interface AnalysisSummary {
  recommendation?: string;
  keyPoints?: string[];
  strengths?: string[];
  concerns?: string[];
  reasoning?: string;
}

export type { AnalysisData } from './schemas';
