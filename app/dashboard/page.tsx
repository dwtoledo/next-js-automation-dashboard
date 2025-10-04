import prisma from '@/lib/prisma';
import { transformJobAnalysis } from '@/lib/utils';
import JobsTable from '@/components/JobsTable';

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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard de Vagas</h1>
        <p className="text-gray-600">
          Gerencie e analise as vagas pendentes de análise
        </p>
      </div>

      <JobsTable jobs={jobRows} totalCount={totalCount} />
    </div>
  );
}
