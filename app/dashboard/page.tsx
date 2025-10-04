import type { Metadata } from "next";
import prisma from '@/lib/prisma';
import { buildPrismaQuery, transformJobAnalysis, parseSearchParams } from '@/lib/utils';
import JobsTable from '@/components/JobsTable';
import FiltersPanel from '@/components/FiltersPanel';
import PaginationControls from '@/components/PaginationControls';
import {
  MANUAL_STATUS_FILTERS,
  IA_RECOMMENDATION_FILTERS,
  SENIORITY_LEVEL_FILTERS,
  HEADER_CONFIG,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: HEADER_CONFIG["/dashboard"].title,
  description: HEADER_CONFIG["/dashboard"].description,
};

interface DashboardPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const rawSearchParams = await searchParams;
  const resolvedSearchParams = parseSearchParams(rawSearchParams);

  const queryOptions = buildPrismaQuery(resolvedSearchParams);

  const [jobs, totalCount] = await Promise.all([
    prisma.jobAnalysis.findMany({
      where: queryOptions.where,
      orderBy: queryOptions.orderBy,
      skip: queryOptions.skip,
      take: queryOptions.take,
    }),
    prisma.jobAnalysis.count({
      where: queryOptions.where,
    }),
  ]);

  const jobRows = jobs.map(transformJobAnalysis);

  const filterConfigs = {
    manualStatusFilters: MANUAL_STATUS_FILTERS,
    iaRecommendationFilters: IA_RECOMMENDATION_FILTERS,
    seniorityLevelFilters: SENIORITY_LEVEL_FILTERS,
  };

  const limit = parseInt(resolvedSearchParams.limit || '20', 10);
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="container mx-auto p-6">
      <FiltersPanel filterConfigs={filterConfigs} />

      <JobsTable jobs={jobRows} />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </div>
  );
}