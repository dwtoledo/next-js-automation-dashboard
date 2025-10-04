import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { JobAnalysisRow, FilterOption, JobAnalysis } from './types';
import { RECOMMENDATION_VARIANT_MAP, SENIORITY_VARIANT_MAP, STATUS_VARIANT_MAP, type BadgeVariant } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusBadgeVariant(status: string): BadgeVariant {
  return STATUS_VARIANT_MAP[status] || 'gray';
}

export function getRecommendationBadgeVariant(recommendation: string): BadgeVariant {
  return RECOMMENDATION_VARIANT_MAP[recommendation] || 'gray';
}

export function getSeniorityBadgeVariant(seniority: string): BadgeVariant {
  return SENIORITY_VARIANT_MAP[seniority] || 'gray';
}

export function transformJobAnalysis(job: NonNullable<JobAnalysis>): JobAnalysisRow {
  const analysisData = job.analysisData as Record<string, unknown>;
  const experienceRequirements = analysisData?.experienceRequirements as Record<string, unknown> | undefined;
  const summary = analysisData?.summary as Record<string, unknown> | undefined;
  
  return {
    id: job.id,
    jobId: job.jobId,
    jobUrl: job.jobUrl,
    jobTitle: job.jobTitle,
    companyName: job.companyName,
    jobDescription: job.jobDescription,
    isApplied: job.isApplied,
    hasEasyApply: job.hasEasyApply,
    overallCompatibility: job.overallCompatibility,
    manualStatus: job.manualStatus,
    manualDecisionAt: job.manualDecisionAt,
    manualNotes: job.manualNotes,
    recruiterUrl: job.recruiterUrl,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    experienceRequired: experienceRequirements?.minimumYears 
      ? `${experienceRequirements.minimumYears}+ anos` 
      : undefined,
    seniorityLevel: experienceRequirements?.seniorityLevel as string | undefined,
    iaRecommendation: summary?.recommendation as string | undefined,
  };
}

export function getFilterOption(
  filters: FilterOption[],
  value: string
): FilterOption | undefined {
  return filters.find((filter) => filter.value === value);
}

export function getFilterLabel(
  filters: FilterOption[],
  value: string
): string {
  return getFilterOption(filters, value)?.label || value;
}

export function getFilterColor(
  filters: FilterOption[],
  value: string
): string {
  return getFilterOption(filters, value)?.color || 'bg-gray-100 text-gray-800 border-gray-300';
}
