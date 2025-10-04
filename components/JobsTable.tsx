'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { JobAnalysisRow } from '@/lib/types';
import { getStatusBadgeVariant, getRecommendationBadgeVariant, getFilterLabel } from '@/lib/utils';
import { IA_RECOMMENDATION_FILTERS, MANUAL_STATUS_FILTERS } from '@/lib/constants';

interface JobsTableProps {
  jobs: JobAnalysisRow[];
  totalCount: number;
}

export default function JobsTable({ jobs, totalCount }: JobsTableProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 font-semibold';
    if (score >= 60) return 'text-blue-600 font-semibold';
    if (score >= 40) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>
          Mostrando {jobs.length} de {totalCount} vagas pendentes
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Compatibilidade</TableHead>
            <TableHead className="w-[250px]">Vaga</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead className="text-center">Easy Apply</TableHead>
            <TableHead>Senioridade</TableHead>
            <TableHead>Experiência</TableHead>
            <TableHead>Recomendação IA</TableHead>
            <TableHead className="text-right">Data da Análise</TableHead>
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
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {job.jobTitle}
                  </a>
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
                  {formatDate(job.createdAt)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                Nenhuma vaga pendente encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
