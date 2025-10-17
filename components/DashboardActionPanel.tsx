'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MANUAL_STATUS_FILTERS } from '@/lib/constants';
import { updateMultipleJobStatuses } from '@/app/actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { ManualStatus } from '@prisma/client';

interface DashboardActionPanelProps {
  selectedJobIds: string[];
  onUpdateComplete: () => void;
}

export default function DashboardActionPanel({ selectedJobIds, onUpdateComplete }: DashboardActionPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [newStatus, setNewStatus] = useState<ManualStatus | ''>((MANUAL_STATUS_FILTERS[0]?.value as ManualStatus) || '');
  const [newNotes, setNewNotes] = useState('');

  if (selectedJobIds.length === 0) {
    return null;
  }

  const handleSubmit = () => {
    if (!newStatus) {
      toast.error('Selecione um status para aplicar às vagas.');
      return;
    }

    startTransition(async () => {
      const result = await updateMultipleJobStatuses({
        jobIds: selectedJobIds,
        newStatus,
        newNotes,
      });

      if (result.success) {
        toast.success(`${selectedJobIds.length} vaga(s) atualizada(s) com sucesso!`)
        onUpdateComplete();
        setNewNotes('');
      } else {
        toast.error('Erro ao atualizar vagas', {
          description: result.error || 'Ocorreu um erro inesperado.',
        });
      }
    });
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-sm sm:text-base">
              {selectedJobIds.length} vaga(s) selecionada(s)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ManualStatus)}>
              <SelectTrigger className="h-9 w-full sm:w-[180px]">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                {MANUAL_STATUS_FILTERS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Anotação (opcional)"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="h-9 w-full sm:w-[200px]"
            />
            <Button onClick={handleSubmit} disabled={isPending || !newStatus} className="h-9 w-full sm:w-auto">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Aplicar Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
