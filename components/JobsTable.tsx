'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { JobAnalysisRow } from '@/lib/types';
import {
  getStatusOutlineVariant,
  getRecommendationOutlineVariant,
  getFilterLabel,
  formatDateTimeBR,
} from '@/lib/utils';
import { IA_RECOMMENDATION_FILTERS, MANUAL_STATUS_FILTERS, SENIORITY_LEVEL_FILTERS } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import SortableHeader from '@/components/SortableHeader';
import { updateJobStatus } from '@/app/actions';
import { toast } from 'sonner';
import { Linkedin, User, X, Loader2, NotepadText } from 'lucide-react';
import CompatibilityDonut from '@/components/CompatibilityDonut';

interface JobsTableProps {
  jobs: JobAnalysisRow[];
}

export default function JobsTable({ jobs }: JobsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [ignoringJobs, setIgnoringJobs] = useState<Set<string>>(new Set());
  const [jobToIgnore, setJobToIgnore] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    setSelectedJobs(new Set());
  }, [jobs]);

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
    setJobToIgnore(null);

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

  const openIgnoreDialog = (jobId: string, jobTitle: string) => {
    setJobToIgnore({ id: jobId, title: jobTitle });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-10">
                <Checkbox 
                  checked={
                    jobs.length > 0 && selectedJobs.size === jobs.length
                      ? true
                      : selectedJobs.size > 0 && selectedJobs.size < jobs.length
                      ? 'indeterminate'
                      : false
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedJobs(new Set(jobs.map((job) => job.id)));
                    } else {
                      setSelectedJobs(new Set());
                    }
                  }}
                  aria-label="Selecionar todas as vagas"
                />
              </TableHead>
              <SortableHeader field="overallCompatibility" onSort={handleSort}>Compatibilidade</SortableHeader>
              <TableHead>Vaga</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Recomendação da IA</TableHead>
              <TableHead className="text-center">Experiência</TableHead>
              <TableHead className="text-center">Senioridade</TableHead>
              <SortableHeader field="createdAt" onSort={handleSort}>Data</SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <TableRow
                  key={job.id}
                  data-state={selectedJobs.has(job.id) ? 'selected' : undefined}
                  className="[&[data-state=selected]]:bg-muted/50"
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedJobs.has(job.id)}
                      onCheckedChange={(checked) => {
                        setSelectedJobs((prev) => {
                          const next = new Set(prev);
                          if (checked) {
                            next.add(job.id);
                          } else {
                            next.delete(job.id);
                          }
                          return next;
                        });
                      }}
                      aria-label={`Selecionar vaga ${job.jobTitle}`}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <CompatibilityDonut score={job.overallCompatibility} size="md" showLabel={false} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium whitespace-normal">
                    <div className="flex flex-col">
                      <div className="mb-1">
                        <a
                          href={`/vaga/${job.id}`}
                          className="text-foreground hover:underline font-bold"
                          title={job.jobTitle}
                        >
                          {job.jobTitle}
                        </a>
                        {job.hasEasyApply && (
                          <Badge variant="outline-green" className="text-[10px] px-1 py-0 ml-1.5 inline-flex align-middle h-4">
                            Easy Apply
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground mb-2">
                        {job.companyName}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <a
                          href={`/vaga/${job.id}`}
                          title="Ver detalhes da vaga"
                        >
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-accent p-1 h-7 w-7 flex items-center justify-center"
                          >
                            <NotepadText className="size-4" />
                          </Badge>
                        </a>
                        <a
                          href={job.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir no LinkedIn"
                        >
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-accent p-1 h-7 w-7 flex items-center justify-center"
                          >
                            <Linkedin className="size-4" />
                          </Badge>
                        </a>
                        {job.recruiterUrl && (
                          <a
                            href={job.recruiterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Perfil do Recrutador"
                          >
                            <Badge
                              variant="outline"
                              className="cursor-pointer hover:bg-accent p-1 h-7 w-7 flex items-center justify-center"
                            >
                              <User className="size-4" />
                            </Badge>
                          </a>
                        )}
                        {job.manualStatus !== 'IGNORED' && (
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-accent p-1 h-7 w-7 flex items-center justify-center"
                            onClick={(e) => {
                              e.preventDefault();
                              openIgnoreDialog(job.id, job.jobTitle);
                            }}
                            title={ignoringJobs.has(job.id) ? "Ignorando..." : "Ignorar vaga"}
                          >
                            {ignoringJobs.has(job.id) ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <X className="size-4" />
                            )}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusOutlineVariant(job.manualStatus)}>
                      {getFilterLabel(MANUAL_STATUS_FILTERS, job.manualStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {job.iaRecommendation ? (
                      <Badge variant={getRecommendationOutlineVariant(job.iaRecommendation)}>
                        {getFilterLabel(IA_RECOMMENDATION_FILTERS, job.iaRecommendation)}
                      </Badge>
                    ) : (
                      <Badge variant="outline-gray">N/A</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {job.experienceRequired ? (
                      <Badge variant="outline-gray">
                        {job.experienceRequired}
                      </Badge>
                    ) : (
                      <Badge variant="outline-gray">N/A</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {job.seniorityLevel ? (
                      <Badge variant="outline-gray">
                        {getFilterLabel(SENIORITY_LEVEL_FILTERS, job.seniorityLevel)}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-500">
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

      <AlertDialog open={!!jobToIgnore} onOpenChange={(open) => !open && setJobToIgnore(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja ignorar esta vaga?</AlertDialogTitle>
            <AlertDialogDescription>
              A vaga <strong>{jobToIgnore?.title}</strong> será marcada como ignorada e não aparecerá mais na lista de vagas pendentes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (jobToIgnore) {
                  handleIgnore(jobToIgnore.id, jobToIgnore.title);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Ignorar Vaga
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
