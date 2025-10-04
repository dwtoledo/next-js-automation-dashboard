import prisma from '@/lib/prisma';
import { buildPrismaQuery, transformJobAnalysis } from '@/lib/utils';
import JobsTable from '@/components/JobsTable';
import FiltersPanel from '@/components/FiltersPanel';
import PaginationControls from '@/components/PaginationControls';
import {
  MANUAL_STATUS_FILTERS,
  IA_RECOMMENDATION_FILTERS,
  SENIORITY_LEVEL_FILTERS,
} from '@/lib/constants';
import type { JobAnalysisSearchParams } from '@/lib/types';

interface DashboardPageProps {
  searchParams: Promise<JobAnalysisSearchParams>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard de Vagas</h1>
        <p className="text-muted-foreground">
          Gerencie e analise as vagas pendentes de análise
        </p>
      </div>

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