'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { JobAnalysisRow } from '@/lib/types';
import { 
  getStatusBadgeVariant, 
  getRecommendationBadgeVariant, 
  getFilterLabel,
  formatDateTimeBR,
  getCompatibilityColor
} from '@/lib/utils';
import { IA_RECOMMENDATION_FILTERS, MANUAL_STATUS_FILTERS } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import SortableHeader from '@/components/SortableHeader';
import TableRowActions from '@/components/TableRowActions';

export default function JobsTable({ jobs }: { jobs: JobAnalysisRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSortBy = params.get('sortBy');
    const currentSortOrder = params.get('sortOrder');

    if (currentSortBy === field) {
      const newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
      params.set('sortOrder', newOrder);
    } else {
      params.set('sortBy', field);
      params.set('sortOrder', 'desc');
    }

    params.set('page', '1');

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <SortableHeader field="overallCompatibility" onSort={handleSort}>Compatibilidade</SortableHeader>
            <TableHead>Vaga</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Easy Apply</TableHead>
            <TableHead>Senioridade</TableHead>
            <TableHead>Experiência</TableHead>
            <TableHead>Recomendação IA</TableHead>
            <SortableHeader field="createdAt" onSort={handleSort}>Data da Análise</SortableHeader>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(job.manualStatus)}>
                    {getFilterLabel(MANUAL_STATUS_FILTERS, job.manualStatus)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className={getCompatibilityColor(job.overallCompatibility)}>
                    {job.overallCompatibility}%
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {job.jobTitle}
                    </a>
                    {job.recruiterUrl && (
                      <a
                        href={job.recruiterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-orange-50 border-orange-600 text-orange-600 text-xs"
                        >
                          Ver Recrutador
                        </Badge>
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell className="text-center">
                  {job.hasEasyApply ? (
                    <Badge variant="green">
                      ✓ Sim
                    </Badge>
                  ) : (
                    <Badge variant="gray">
                      ✗ Não
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {job.seniorityLevel || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {job.experienceRequired || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  {job.iaRecommendation ? (
                    <Badge variant={getRecommendationBadgeVariant(job.iaRecommendation)}>
                      {getFilterLabel(IA_RECOMMENDATION_FILTERS, job.iaRecommendation)}
                    </Badge>
                  ) : (
                    <Badge variant="gray">N/A</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm text-gray-500">
                  {formatDateTimeBR(job.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <TableRowActions
                    jobId={job.id}
                    manualStatus={job.manualStatus}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                Nenhuma vaga pendente encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
