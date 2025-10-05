import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  RECOMMENDATION_VARIANT_MAP, 
  IA_RECOMMENDATION_FILTERS,
  SENIORITY_VARIANT_MAP,
  TEXT_COLOR_CLASSES,
  PROGRESS_BAR_CLASSES,
  getCompatibilityVariant,
  type BadgeVariant 
} from '@/lib/constants';
import type { ExperienceRequirements } from '@/lib/types';

interface QuickVerdictProps {
  overallCompatibility: number;
  recommendation?: string;
  experienceRequirements?: ExperienceRequirements;
}

export function QuickVerdict({
  overallCompatibility,
  recommendation,
  experienceRequirements,
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
      </Card>
      <Card className="p-6 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Recomendação da IA
        </h3>
        <div className="flex items-center">
          <Badge variant={recommendationVariant} className="text-base px-4 py-2">
            {recommendationLabel}
          </Badge>
        </div>
      </Card>
      <Card className="p-6 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Experiência Principal
        </h3>
        <div className="space-y-2">
          {experienceRequirements?.minimumYears !== undefined && (
            <div>
              <dt className="text-xs text-muted-foreground">Anos Requeridos</dt>
              <dd className="text-lg font-semibold">
                {experienceRequirements.minimumYears}+ anos
              </dd>
            </div>
          )}
          {experienceRequirements?.seniorityLevel && (
            <div>
              <dt className="text-xs text-muted-foreground">Nível de Senioridade</dt>
              <dd className="text-lg">
                <Badge variant={seniorityVariant}>
                  {experienceRequirements.seniorityLevel}
                </Badge>
              </dd>
            </div>
          )}
          {experienceRequirements?.inferenceSource && (
            <div>
              <dt className="text-xs text-muted-foreground">Fonte da Informação</dt>
              <dd className="text-sm font-medium">
                {experienceRequirements.inferenceSource}
              </dd>
            </div>
          )}
          {!experienceRequirements?.minimumYears && 
           !experienceRequirements?.seniorityLevel && 
           !experienceRequirements?.inferenceSource && (
            <p className="text-sm text-muted-foreground">
              Informação não disponível
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
