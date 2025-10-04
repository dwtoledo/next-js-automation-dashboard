import prisma from '@/lib/prisma';
import { transformJobAnalysis } from '@/lib/utils';
import JobsTable from '@/components/JobsTable';
import {
  MANUAL_STATUS_FILTERS,
  IA_RECOMMENDATION_FILTERS,
  SENIORITY_LEVEL_FILTERS,
} from '@/lib/constants';

export default async function DashboardPage() {
  const [jobs, totalCount] = await Promise.all([
    prisma.jobAnalysis.findMany({
      where: {
        manualStatus: 'PENDING',
      },
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.jobAnalysis.count({
      where: {
        manualStatus: 'PENDING',
      },
    }),
  ]);

  const jobRows = jobs.map(transformJobAnalysis);

  // Filter configurations to be passed to FiltersPanel component
  const filterConfigs = {
    manualStatusFilters: MANUAL_STATUS_FILTERS,
    iaRecommendationFilters: IA_RECOMMENDATION_FILTERS,
    seniorityLevelFilters: SENIORITY_LEVEL_FILTERS,
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard de Vagas</h1>
        <p className="text-gray-600">
          Gerencie e analise as vagas pendentes de análise
        </p>
      </div>

      {/* TODO: Add FiltersPanel component here with filterConfigs props */}

      <JobsTable jobs={jobRows} totalCount={totalCount} />
    </div>
  );
}
