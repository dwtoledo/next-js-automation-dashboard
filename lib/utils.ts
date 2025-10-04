import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { JobAnalysisRow, FilterOption, JobAnalysis, JobAnalysisSearchParams } from './types';
import { RECOMMENDATION_VARIANT_MAP, SENIORITY_VARIANT_MAP, STATUS_VARIANT_MAP, type BadgeVariant } from './constants';
import { Prisma } from "@prisma/client";

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

export function buildPrismaQuery(searchParams: JobAnalysisSearchParams) {
  const where: Prisma.JobAnalysisWhereInput = {};
  const orderBy: Prisma.JobAnalysisOrderByWithRelationInput = {};

  if (searchParams.search) {
    const searchTerm = searchParams.search.trim();
    if (searchTerm) {
      where.OR = [
        {
          jobTitle: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          companyName: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ];
    }
  }

  if (searchParams.manualStatus) {
    const statuses = searchParams.manualStatus
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (statuses.length > 0) {
      where.manualStatus = {
        in: statuses as Prisma.EnumManualStatusFilter['in'],
      };
    }
  }

  if (searchParams.seniority) {
    const seniorityLevels = searchParams.seniority
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (seniorityLevels.length > 0) {
      if (seniorityLevels.length === 1) {
        where.analysisData = {
          path: ['experienceRequirements', 'seniorityLevel'],
          equals: seniorityLevels[0],
        } as Prisma.JsonFilter;
      } else {
        where.OR = where.OR || [];
        const seniorityFilters = seniorityLevels.map(level => ({
          analysisData: {
            path: ['experienceRequirements', 'seniorityLevel'],
            equals: level,
          } as Prisma.JsonFilter,
        }));

        if (Array.isArray(where.OR)) {
          where.OR.push(...seniorityFilters);
        }
      }
    }
  }

  if (searchParams.iaRecommendation) {
    const recommendations = searchParams.iaRecommendation
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    if (recommendations.length > 0) {
      if (recommendations.length === 1) {
        const recommendationFilter: Prisma.JsonFilter = {
          path: ['summary', 'recommendation'],
          equals: recommendations[0],
        };

        if (where.analysisData) {
          const existingAND = where.AND ? (Array.isArray(where.AND) ? where.AND : [where.AND]) : [];
          where.AND = [
            ...existingAND,
            { analysisData: where.analysisData },
            { analysisData: recommendationFilter },
          ];
          delete where.analysisData;
        } else {
          where.analysisData = recommendationFilter;
        }
      } else {
        const recommendationFilters = recommendations.map(rec => ({
          analysisData: {
            path: ['summary', 'recommendation'],
            equals: rec,
          } as Prisma.JsonFilter,
        }));

        if (where.analysisData) {
          const existingAND = where.AND ? (Array.isArray(where.AND) ? where.AND : [where.AND]) : [];
          where.AND = [
            ...existingAND,
            { analysisData: where.analysisData },
            { OR: recommendationFilters },
          ];
          delete where.analysisData;
        } else {
          where.OR = where.OR || [];
          if (Array.isArray(where.OR)) {
            where.OR.push(...recommendationFilters);
          }
        }
      }
    }
  }

  if (searchParams.minCompatibility || searchParams.maxCompatibility) {
    where.overallCompatibility = {};

    if (searchParams.minCompatibility) {
      const min = parseInt(searchParams.minCompatibility, 10);
      if (!isNaN(min)) {
        where.overallCompatibility.gte = min;
      }
    }

    if (searchParams.maxCompatibility) {
      const max = parseInt(searchParams.maxCompatibility, 10);
      if (!isNaN(max)) {
        where.overallCompatibility.lte = max;
      }
    }
  }

  if (searchParams.minExperience || searchParams.maxExperience) {
    const experienceFilters: Prisma.JsonFilter[] = [];

    if (searchParams.minExperience) {
      const min = parseInt(searchParams.minExperience, 10);
      if (!isNaN(min)) {
        experienceFilters.push({
          path: ['experienceRequirements', 'minimumYears'],
          gte: min,
        });
      }
    }

    if (searchParams.maxExperience) {
      const max = parseInt(searchParams.maxExperience, 10);
      if (!isNaN(max)) {
        experienceFilters.push({
          path: ['experienceRequirements', 'minimumYears'],
          lte: max,
        });
      }
    }

    if (experienceFilters.length > 0) {
      const existingFilters: Prisma.JobAnalysisWhereInput[] = [];

      if (where.analysisData) {
        existingFilters.push({ analysisData: where.analysisData });
        delete where.analysisData;
      }

      if (where.AND) {
        existingFilters.push(...(Array.isArray(where.AND) ? where.AND : [where.AND]));
      }

      where.AND = [
        ...existingFilters,
        ...experienceFilters.map(filter => ({ analysisData: filter })),
      ];
    }
  }

  if (searchParams.dateFrom || searchParams.dateTo) {
    where.createdAt = {};

    if (searchParams.dateFrom) {
      const dateFrom = new Date(searchParams.dateFrom);
      if (!isNaN(dateFrom.getTime())) {
        where.createdAt.gte = dateFrom;
      }
    }

    if (searchParams.dateTo) {
      const dateTo = new Date(searchParams.dateTo);
      if (!isNaN(dateTo.getTime())) {
        dateTo.setHours(23, 59, 59, 999);
        where.createdAt.lte = dateTo;
      }
    }
  }

  const sortBy = searchParams.sortBy || 'createdAt';
  const sortOrder = (searchParams.sortOrder as 'asc' | 'desc') || 'desc';

  const allowedSortFields = [
    'createdAt',
    'updatedAt',
    'overallCompatibility',
    'jobTitle',
    'companyName',
    'manualStatus',
    'manualDecisionAt',
  ];

  if (allowedSortFields.includes(sortBy)) {
    orderBy[sortBy as keyof Prisma.JobAnalysisOrderByWithRelationInput] = sortOrder;
  } else {
    orderBy.createdAt = 'desc';
  }

  const page = parseInt(searchParams.page || '1', 10);
  const limit = parseInt(searchParams.limit || '20', 10);

  const validPage = !isNaN(page) && page > 0 ? page : 1;
  const validLimit = !isNaN(limit) && limit > 0 && limit <= 100 ? limit : 20;

  const skip = (validPage - 1) * validLimit;
  const take = validLimit;

  return {
    where,
    orderBy,
    skip,
    take,
  };
}
