import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { JobAnalysisRow, FilterOption, JobAnalysisNonNull, JobAnalysisSearchParams, ManualStatus } from './types';
import {
  RECOMMENDATION_VARIANT_MAP,
  SENIORITY_VARIANT_MAP,
  STATUS_VARIANT_MAP,
  MANUAL_STATUS_FILTERS,
  type BadgeVariant
} from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidManualStatus(value: string): value is ManualStatus {
  return MANUAL_STATUS_FILTERS.some(filter => filter.value === value);
}

export function isValidSortOrder(value: string | undefined): value is 'asc' | 'desc' {
  return value === 'asc' || value === 'desc';
}

export function isValidSortField(field: string | undefined): boolean {
  const allowedFields = [
    'createdAt',
    'updatedAt',
    'overallCompatibility',
    'jobTitle',
    'companyName',
    'manualStatus',
    'manualDecisionAt',
  ];
  return field ? allowedFields.includes(field) : false;
}

export function parseNumericWithBounds(
  value: string | undefined,
  defaultValue: number,
  min?: number,
  max?: number
): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return defaultValue;

  let result = parsed;
  if (min !== undefined) result = Math.max(min, result);
  if (max !== undefined) result = Math.min(max, result);

  return result;
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

export function transformJobAnalysis(job: JobAnalysisNonNull): JobAnalysisRow {
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

export function formatDateTimeBR(date: Date): string {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getCompatibilityColor(score: number): string {
  if (score >= 80) return 'text-green-600 font-semibold';
  if (score >= 60) return 'text-blue-600 font-semibold';
  if (score >= 40) return 'text-yellow-600 font-semibold';
  return 'text-red-600 font-semibold';
}

export function getScoreColorVariant(score: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  if (score >= 40) return 'orange';
  return 'red';
}

export function formatCategoryName(key: string): string {
  const categoryMap: Record<string, string> = {
    technical: 'Técnico',
    experience: 'Experiência',
    education: 'Educação',
    soft_skills: 'Soft Skills',
    cultural_fit: 'Fit Cultural',
    language: 'Idiomas',
  };
  
  return categoryMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
}

export function getConfidenceLevelVariant(level: string | undefined): 'green' | 'yellow' | 'red' | 'gray' {
  switch (level) {
    case 'High':
      return 'green';
    case 'Medium':
      return 'yellow';
    case 'Low':
      return 'red';
    default:
      return 'gray';
  }
}

function parseNumericParam(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return !isNaN(parsed) ? parsed : defaultValue;
}

function parseDateParam(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return !isNaN(date.getTime()) ? date : undefined;
}

function parseBooleanParam(value: string | undefined): boolean | undefined {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

function splitAndFilterParams(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

function parseManualStatuses(value: string | undefined): ManualStatus[] {
  const statuses = splitAndFilterParams(value);
  return statuses.filter(isValidManualStatus);
}

function buildSearchFilter(searchTerm: string | undefined): Prisma.JobAnalysisWhereInput {
  const where: Prisma.JobAnalysisWhereInput = {};

  if (!searchTerm) return where;

  const trimmedSearch = searchTerm.trim();
  if (trimmedSearch) {
    where.OR = [
      { jobTitle: { contains: trimmedSearch, mode: 'insensitive' } },
      { companyName: { contains: trimmedSearch, mode: 'insensitive' } },
    ];
  }

  return where;
}

function buildManualStatusFilter(manualStatus: string | undefined): Prisma.JobAnalysisWhereInput {
  const where: Prisma.JobAnalysisWhereInput = {};

  if (!manualStatus) return where;

  const statuses = parseManualStatuses(manualStatus);
  if (statuses.length > 0) {
    where.manualStatus = { in: statuses };
  }

  return where;
}

function buildJsonPathFilter(
  path: string[],
  values: string[]
): Prisma.JsonFilter | Prisma.JobAnalysisWhereInput {
  if (values.length === 0) return {};

  if (values.length === 1) {
    return { path, equals: values[0] } as Prisma.JsonFilter;
  }

  return {
    OR: values.map(value => ({
      analysisData: { path, equals: value } as Prisma.JsonFilter,
    })),
  };
}

function buildSeniorityFilter(seniority: string | undefined): Prisma.JobAnalysisWhereInput {
  const where: Prisma.JobAnalysisWhereInput = {};

  if (!seniority) return where;

  const seniorityLevels = splitAndFilterParams(seniority);
  if (seniorityLevels.length === 0) return where;

  const filter = buildJsonPathFilter(['experienceRequirements', 'seniorityLevel'], seniorityLevels);

  if ('OR' in filter) {
    where.OR = filter.OR;
  } else if ('path' in filter) {
    where.analysisData = filter;
  }

  return where;
}

function buildIARecommendationFilter(iaRecommendation: string | undefined): Prisma.JobAnalysisWhereInput {
  const where: Prisma.JobAnalysisWhereInput = {};

  if (!iaRecommendation) return where;

  const recommendations = splitAndFilterParams(iaRecommendation);
  if (recommendations.length === 0) return where;

  const filter = buildJsonPathFilter(['summary', 'recommendation'], recommendations);

  if ('OR' in filter) {
    where.OR = filter.OR;
  } else if ('path' in filter) {
    where.analysisData = filter;
  }

  return where;
}

function buildCompatibilityFilter(
  minCompatibility: string | undefined,
  maxCompatibility: string | undefined
): Prisma.JobAnalysisWhereInput {
  const where: Prisma.JobAnalysisWhereInput = {};

  if (!minCompatibility && !maxCompatibility) return where;

  where.overallCompatibility = {};

  if (minCompatibility) {
    const min = parseNumericParam(minCompatibility, 0);
    where.overallCompatibility.gte = min;
  }

  if (maxCompatibility) {
    const max = parseNumericParam(maxCompatibility, 100);
    where.overallCompatibility.lte = max;
  }

  return where;
}

function buildExperienceFilter(
  minExperience: string | undefined,
  maxExperience: string | undefined
): Prisma.JobAnalysisWhereInput {
  const where: Prisma.JobAnalysisWhereInput = {};

  if (!minExperience && !maxExperience) return where;

  const filters: { analysisData: Prisma.JsonFilter }[] = [];

  if (minExperience) {
    const min = parseNumericParam(minExperience, 0);
    filters.push({
      analysisData: {
        path: ['experienceRequirements', 'minimumYears'],
        gte: min,
      } as Prisma.JsonFilter,
    });
  }

  if (maxExperience) {
    const max = parseNumericParam(maxExperience, 20);
    filters.push({
      analysisData: {
        path: ['experienceRequirements', 'minimumYears'],
        lte: max,
      } as Prisma.JsonFilter,
    });
  }

  if (filters.length > 0) {
    where.AND = filters;
  }

  return where;
}

function buildDateRangeFilter(
  dateFrom: string | undefined,
  dateTo: string | undefined
): Prisma.JobAnalysisWhereInput {
  const where: Prisma.JobAnalysisWhereInput = {};

  if (!dateFrom && !dateTo) return where;

  where.createdAt = {};

  if (dateFrom) {
    const from = parseDateParam(dateFrom);
    if (from) {
      where.createdAt.gte = from;
    }
  }

  if (dateTo) {
    const to = parseDateParam(dateTo);
    if (to) {
      to.setHours(23, 59, 59, 999);
      where.createdAt.lte = to;
    }
  }

  return where;
}

function buildBooleanFilter(
  isApplied: boolean | undefined,
  hasEasyApply: boolean | undefined
): Prisma.JobAnalysisWhereInput {
  const where: Prisma.JobAnalysisWhereInput = {};

  if (isApplied !== undefined) {
    where.isApplied = isApplied;
  }

  if (hasEasyApply !== undefined) {
    where.hasEasyApply = hasEasyApply;
  }

  return where;
}

function mergeWhereConditions(conditions: Prisma.JobAnalysisWhereInput[]): Prisma.JobAnalysisWhereInput {
  const mergedWhere: Prisma.JobAnalysisWhereInput = {};
  const andConditions: Prisma.JobAnalysisWhereInput[] = [];
  const orConditions: Prisma.JobAnalysisWhereInput[] = [];

  for (const condition of conditions) {
    if (Object.keys(condition).length === 0) continue;

    if (condition.OR) {
      orConditions.push(...(Array.isArray(condition.OR) ? condition.OR : [condition.OR]));
      continue;
    }

    if (condition.AND) {
      andConditions.push(...(Array.isArray(condition.AND) ? condition.AND : [condition.AND]));
      continue;
    }

    for (const [key, value] of Object.entries(condition)) {
      if (key === 'analysisData') {
        andConditions.push({ analysisData: value as Prisma.JsonFilter });
      } else if (key in mergedWhere) {
        andConditions.push({ [key]: value } as Prisma.JobAnalysisWhereInput);
      } else {
        mergedWhere[key as keyof Prisma.JobAnalysisWhereInput] = value as never;
      }
    }
  }

  if (orConditions.length > 0) {
    if (mergedWhere.OR) {
      mergedWhere.AND = [
        { OR: mergedWhere.OR },
        { OR: orConditions },
      ];
      delete mergedWhere.OR;
    } else {
      mergedWhere.OR = orConditions;
    }
  }

  if (andConditions.length > 0) {
    if (mergedWhere.AND) {
      mergedWhere.AND = Array.isArray(mergedWhere.AND)
        ? [...mergedWhere.AND, ...andConditions]
        : [mergedWhere.AND, ...andConditions];
    } else {
      mergedWhere.AND = andConditions;
    }
  }

  return mergedWhere;
}

function buildOrderBy(
  sortBy: string | undefined,
  sortOrder: string | undefined
): Prisma.JobAnalysisOrderByWithRelationInput {
  const field = isValidSortField(sortBy) ? sortBy! : 'createdAt';
  const order = isValidSortOrder(sortOrder) ? sortOrder : 'desc';

  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[field] = order;

  return orderBy as Prisma.JobAnalysisOrderByWithRelationInput;
}

function buildPagination(page: string | undefined, limit: string | undefined) {
  const validPage = parseNumericWithBounds(page, 1, 1);
  const validLimit = parseNumericWithBounds(limit, 20, 1, 100);

  return {
    skip: (validPage - 1) * validLimit,
    take: validLimit,
  };
}

export function buildPrismaQuery(searchParams: JobAnalysisSearchParams) {
  const filterConditions = [
    buildSearchFilter(searchParams.search),
    buildManualStatusFilter(searchParams.manualStatus),
    buildSeniorityFilter(searchParams.seniority),
    buildIARecommendationFilter(searchParams.iaRecommendation),
    buildCompatibilityFilter(searchParams.minCompatibility, searchParams.maxCompatibility),
    buildExperienceFilter(searchParams.minExperience, searchParams.maxExperience),
    buildDateRangeFilter(searchParams.dateFrom, searchParams.dateTo),
    buildBooleanFilter(searchParams.isApplied, searchParams.hasEasyApply),
  ];

  const where = mergeWhereConditions(filterConditions);

  const orderBy = buildOrderBy(searchParams.sortBy, searchParams.sortOrder);

  const pagination = buildPagination(searchParams.page, searchParams.limit);

  return {
    where,
    orderBy,
    ...pagination,
  };
}

export function parseSearchParams(rawParams: Record<string, string | undefined>): JobAnalysisSearchParams {
  return {
    search: rawParams.search,
    isApplied: parseBooleanParam(rawParams.isApplied),
    hasEasyApply: parseBooleanParam(rawParams.hasEasyApply),
    manualStatus: rawParams.manualStatus,
    seniority: rawParams.seniority,
    iaRecommendation: rawParams.iaRecommendation,
    minCompatibility: rawParams.minCompatibility,
    maxCompatibility: rawParams.maxCompatibility,
    minExperience: rawParams.minExperience,
    maxExperience: rawParams.maxExperience,
    dateFrom: rawParams.dateFrom,
    dateTo: rawParams.dateTo,
    sortBy: rawParams.sortBy,
    sortOrder: rawParams.sortOrder,
    page: rawParams.page,
    limit: rawParams.limit,
  };
}
