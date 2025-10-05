'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { JobAnalysisRow } from '@/lib/types';
import {
  getStatusBadgeVariant,
  getRecommendationBadgeVariant,
  getFilterLabel,
  formatDateTimeBR,
  getCompatibilityColor
} from '@/lib/utils';
import { IA_RECOMMENDATION_FILTERS, MANUAL_STATUS_FILTERS, SENIORITY_LEVEL_FILTERS } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import SortableHeader from '@/components/SortableHeader';
import { updateJobStatus } from '@/app/actions';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

interface JobsTableProps {
  jobs: JobAnalysisRow[];
}

export default function JobsTable({ jobs }: JobsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ignoringJobs, setIgnoringJobs] = useState<Set<string>>(new Set());

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

  const handleIgnore = async (jobId: string, jobTitle: string) => {
    setIgnoringJobs(prev => new Set(prev).add(jobId));

    try {
      const result = await updateJobStatus(jobId, 'IGNORED');
      if (!result.success) {
        toast.error('Erro ao ignorar vaga', {
          description: 'Não foi possível ignorar a vaga. Tente novamente.',
        });
      } else {
        toast.success('Vaga ignorada com sucesso', {
          description: `"${jobTitle}" foi marcada como ignorada.`,
        });
      }
    } catch (error) {
      console.error('Error ignoring job:', error);
      toast.error('Erro ao ignorar vaga', {
        description: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    } finally {
      setIgnoringJobs(prev => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <SortableHeader field="overallCompatibility" onSort={handleSort}>Compatibilidade</SortableHeader>
            <TableHead>Vaga</TableHead>
            <TableHead>Easy Apply</TableHead>
            <TableHead>Senioridade</TableHead>
            <TableHead>Experiência</TableHead>
            <TableHead>Recomendação IA</TableHead>
            <SortableHeader field="createdAt" onSort={handleSort}>Data da Análise</SortableHeader>
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
                  <div className="flex flex-col">
                    <a
                      href={`/vaga/${job.id}`}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      {job.jobTitle}
                    </a>
                    <span className="text-sm text-muted-foreground mb-2">
                      {job.companyName}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50 border-blue-600 text-blue-600 text-xs"
                        >
                          LinkedIn
                        </Badge>
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
                            Recrutador
                          </Badge>
                        </a>
                      )}
                      {job.manualStatus !== 'IGNORED' && (
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-red-50 border-red-600 text-red-600 text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            handleIgnore(job.id, job.jobTitle);
                          }}
                        >
                          {ignoringJobs.has(job.id) ? (
                            <>
                              <Check className="size-3 mr-1" />
                              Ignorando...
                            </>
                          ) : (
                            <>
                              Ignorar
                            </>
                          )}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
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
                    {job.seniorityLevel ? getFilterLabel(SENIORITY_LEVEL_FILTERS, job.seniorityLevel) : 'N/A'}
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                Nenhuma vaga pendente encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
