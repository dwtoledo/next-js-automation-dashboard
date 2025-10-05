import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ActionPanel } from '@/components/ActionPanel';
import { ManualStatus } from '@prisma/client';
import { 
  RECOMMENDATION_VARIANT_MAP, 
  IA_RECOMMENDATION_FILTERS,
  SENIORITY_VARIANT_MAP,
  SENIORITY_LEVEL_FILTERS,
  INFERENCE_SOURCE_VARIANT_MAP,
  INFERENCE_SOURCE_FILTERS,
  TEXT_COLOR_CLASSES,
  PROGRESS_BAR_CLASSES,
  getCompatibilityVariant,
} from '@/lib/constants';
import type { ExperienceRequirements } from '@/lib/types';

interface QuickVerdictProps {
  overallCompatibility: number;
  recommendation?: string;
  experienceRequirements?: ExperienceRequirements;
  jobId: string;
  initialManualStatus: ManualStatus;
  initialManualNotes: string | null;
}

export function QuickVerdict({
  overallCompatibility,
  recommendation,
  experienceRequirements,
  jobId,
  initialManualStatus,
  initialManualNotes,
}: QuickVerdictProps) {
  const compatibilityVariant = getCompatibilityVariant(overallCompatibility);
  const textColorClass = TEXT_COLOR_CLASSES[compatibilityVariant] || TEXT_COLOR_CLASSES.gray;
  const progressBarClass = PROGRESS_BAR_CLASSES[compatibilityVariant] || PROGRESS_BAR_CLASSES.gray;

  const recommendationVariant = recommendation 
    ? RECOMMENDATION_VARIANT_MAP[recommendation] || 'gray'
    : 'gray';
  
  const recommendationLabel = recommendation
    ? IA_RECOMMENDATION_FILTERS.find(filter => filter.value === recommendation)?.label || recommendation
    : 'Não disponível';

  const seniorityVariant = experienceRequirements?.seniorityLevel
    ? SENIORITY_VARIANT_MAP[experienceRequirements.seniorityLevel] || 'gray'
    : 'gray';

  const seniorityLabel = experienceRequirements?.seniorityLevel
    ? SENIORITY_LEVEL_FILTERS.find(filter => filter.value === experienceRequirements.seniorityLevel)?.label || experienceRequirements.seniorityLevel
    : null;

  const inferenceSourceVariant = experienceRequirements?.inferenceSource
    ? INFERENCE_SOURCE_VARIANT_MAP[experienceRequirements.inferenceSource] || 'gray'
    : 'gray';

  const inferenceSourceLabel = experienceRequirements?.inferenceSource
    ? INFERENCE_SOURCE_FILTERS.find(filter => filter.value === experienceRequirements.inferenceSource)?.label || experienceRequirements.inferenceSource
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Compatibilidade Geral
        </h3>
        <div className="space-y-2">
          <div className={`text-4xl font-bold ${textColorClass}`}>
            {overallCompatibility}%
          </div>
          <Progress 
            value={overallCompatibility} 
            className={progressBarClass}
          />
        </div>
        
        <div className="border-t pt-3 space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Recomendação da IA
          </h4>
          <div>
            <Badge variant={recommendationVariant} className="text-base px-4 py-2">
              {recommendationLabel}
            </Badge>
          </div>
        </div>
      </Card>
      <Card className="p-6 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Experiência Principal
        </h3>
        <div className="space-y-3">
          {experienceRequirements?.minimumYears !== undefined && (
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground uppercase tracking-wide">Anos Requeridos</dt>
              <dd className="text-lg font-semibold">
                {experienceRequirements.minimumYears}+ anos
              </dd>
            </div>
          )}
          {experienceRequirements?.seniorityLevel && seniorityLabel && (
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground uppercase tracking-wide">Nível de Senioridade</dt>
              <dd className="text-lg">
                <Badge variant={seniorityVariant}>
                  {seniorityLabel}
                </Badge>
              </dd>
            </div>
          )}
          {inferenceSourceLabel && (
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground uppercase tracking-wide">Fonte da Informação</dt>
              <dd>
                <Badge variant={inferenceSourceVariant}>
                  {inferenceSourceLabel}
                </Badge>
              </dd>
            </div>
          )}
          {!experienceRequirements?.minimumYears && 
           !seniorityLabel && 
           !inferenceSourceLabel && (
            <p className="text-sm text-muted-foreground">
              Informação não disponível
            </p>
          )}
        </div>
      </Card>
      <div className="md:col-span-1">
        <ActionPanel
          initialManualStatus={initialManualStatus}
          initialManualNotes={initialManualNotes}
          jobId={jobId}
        />
      </div>
    </div>
  );
}
