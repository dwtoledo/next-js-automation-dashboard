import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { STATUS_VARIANT_MAP, DATE_FORMATS } from '@/lib/constants';
import type { BadgeVariant } from '@/lib/constants';

interface JobDetailHeaderProps {
  jobTitle: string;
  companyName: string;
  manualStatus: string;
  hasEasyApply: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function JobDetailHeader({
  jobTitle,
  companyName,
  manualStatus,
  hasEasyApply,
  createdAt,
  updatedAt,
}: JobDetailHeaderProps) {
  const statusVariant: BadgeVariant = STATUS_VARIANT_MAP[manualStatus] || 'gray';
  const formattedCreatedAt = format(createdAt, DATE_FORMATS.FULL_DATE_TIME, {
    locale: ptBR,
  });
  const formattedUpdatedAt = format(updatedAt, DATE_FORMATS.FULL_DATE_TIME, {
    locale: ptBR,
  });

  return (
    <header className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {jobTitle}
        </h1>
        <h2 className="text-2xl font-semibold text-muted-foreground">
          {companyName}
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusVariant}>
          {manualStatus}
        </Badge>
        {hasEasyApply && (
          <Badge variant="green">
            ⚡️ Easy Apply
          </Badge>
        )}
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>
          <span className="font-medium">Data da análise:</span>{' '}
          {formattedCreatedAt}
        </p>
        <p>
          <span className="font-medium">Última atualização:</span>{' '}
          {formattedUpdatedAt}
        </p>
      </div>
    </header>
  );
}
