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


export interface JobAnalysisSearchParams {
  search?: string;
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

export interface SortableHeaderProps {
  field: string;
  children: React.ReactNode;
  className?: string;
  onSort: (field: string) => void;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export interface TableRowActionsProps {
  jobId: string;
  manualStatus: string;
}
