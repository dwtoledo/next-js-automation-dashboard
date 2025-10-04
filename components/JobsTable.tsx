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
import { JobAnalysisRow } from '@/lib/types';

interface JobsTableProps {
  jobs: JobAnalysisRow[];
  totalCount: number;
}

export default function JobsTable({ jobs, totalCount }: JobsTableProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      INTERESTED: 'bg-green-100 text-green-800',
      IGNORED: 'bg-gray-100 text-gray-800',
      APPLIED: 'bg-blue-100 text-blue-800',
      REJECTED: 'bg-red-100 text-red-800',
      INTERVIEW: 'bg-purple-100 text-purple-800',
      OFFER: 'bg-emerald-100 text-emerald-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
            <TableHead className="w-[250px]">Vaga</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead className="text-center">Compatibilidade</TableHead>
            <TableHead>Senioridade</TableHead>
            <TableHead>Experiência</TableHead>
            <TableHead>Easy Apply</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recomendação IA</TableHead>
            <TableHead className="text-right">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <TableRow key={job.id}>
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
                  <span className={getCompatibilityColor(job.overallCompatibility)}>
                    {job.overallCompatibility}%
                  </span>
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
                <TableCell className="text-center">
                  {job.hasEasyApply ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Sim
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      ✗ Não
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      job.manualStatus
                    )}`}
                  >
                    {job.manualStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm line-clamp-2">
                    {job.iaRecommendation || 'N/A'}
                  </span>
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
