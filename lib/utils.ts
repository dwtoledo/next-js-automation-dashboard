import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import prisma from './prisma';
import type { JobAnalysisRow } from './types';

type JobAnalysis = Awaited<ReturnType<typeof prisma.jobAnalysis.findFirst>>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
