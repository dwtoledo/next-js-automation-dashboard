'use client';

import { useState, useEffect } from 'react';
import { ManualStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MANUAL_STATUS_FILTERS } from '@/lib/constants';

interface ActionPanelProps {
  initialManualStatus: ManualStatus;
  initialManualNotes: string | null;
  jobId: string;
}

export function ActionPanel({
  initialManualStatus,
  initialManualNotes,
  jobId,
}: ActionPanelProps) {
  const [status, setStatus] = useState<ManualStatus>(initialManualStatus);
  const [notes, setNotes] = useState<string>(initialManualNotes ?? '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const notesChanged = notes !== (initialManualNotes ?? '');
    const statusChanged = status !== initialManualStatus;
    setHasChanges(notesChanged || statusChanged);
  }, [status, notes, initialManualStatus, initialManualNotes]);

  const maxChars = 2000;
  const isOverLimit = notes.length > maxChars;

  return (
    <Card className="p-6 space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Painel de Ação
      </h3>
      
      <div className="space-y-2">
        <Label htmlFor="status-select" className="text-xs text-muted-foreground uppercase tracking-wide">
          Definir Status
        </Label>
        <Select value={status} onValueChange={(value) => setStatus(value as ManualStatus)}>
          <SelectTrigger id="status-select">
            <SelectValue placeholder="Selecione um status" />
          </SelectTrigger>
          <SelectContent>
            {MANUAL_STATUS_FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="notes-textarea" className="text-xs text-muted-foreground uppercase tracking-wide">
            Minhas Anotações
          </Label>
          <span
            className={`text-sm ${
              isOverLimit ? 'text-red-500' : 'text-muted-foreground'
            }`}
          >
            {notes.length} / {maxChars}
          </span>
        </div>
        <Textarea
          id="notes-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Adicione suas observações sobre esta vaga..."
          rows={6}
          className={isOverLimit ? 'border-red-500' : ''}
        />
        {isOverLimit && (
          <p className="text-sm text-red-500">
            Você excedeu o limite de caracteres
          </p>
        )}
      </div>

      {hasChanges && (
        <Button 
          className="w-full" 
          size="lg"
          disabled={isOverLimit}
        >
          Salvar Alterações
        </Button>
      )}
    </Card>
  );
}
