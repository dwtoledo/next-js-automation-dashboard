import { Badge } from "@/components/ui/badge";
import type { AnalysisData } from "@/lib/types";
import { getConfidenceLevelVariant } from "@/lib/utils";

interface ExperienceDetailsTabProps {
  experienceRequirements: AnalysisData['experienceRequirements'];
}

export function ExperienceDetailsTab({ experienceRequirements }: ExperienceDetailsTabProps) {
  return (
    <div className="bg-card p-6 rounded-lg border space-y-6">
      <h3 className="text-xl font-semibold mb-4">Experiência Detalhada</h3>
      
      {experienceRequirements ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experienceRequirements.minimumYears !== undefined && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Anos Mínimos Requeridos
                </p>
                <p className="text-base text-muted-foreground">
                  {experienceRequirements.minimumYears} {experienceRequirements.minimumYears === 1 ? 'ano' : 'anos'}
                </p>
              </div>
            )}

            {experienceRequirements.preferredYears !== undefined && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Anos Preferíveis
                </p>
                <p className="text-base text-muted-foreground">
                  {experienceRequirements.preferredYears} {experienceRequirements.preferredYears === 1 ? 'ano' : 'anos'}
                </p>
              </div>
            )}

            {experienceRequirements.seniorityLevel && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Nível de Senioridade
                </p>
                <p className="text-base text-muted-foreground">
                  {experienceRequirements.seniorityLevel}
                </p>
              </div>
            )}

            {experienceRequirements.inferenceSource && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Fonte da Informação
                </p>
                <p className="text-base text-muted-foreground">
                  {experienceRequirements.inferenceSource}
                </p>
              </div>
            )}

            {experienceRequirements.confidenceLevel && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Nível de Confiança da IA
                </p>
                <div>
                  <Badge variant={getConfidenceLevelVariant(experienceRequirements.confidenceLevel)}>
                    {experienceRequirements.confidenceLevel}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {experienceRequirements.reasoningText && (
            <div className="space-y-3 pt-2">
              <h4 className="text-lg font-semibold">Raciocínio da Análise</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {experienceRequirements.reasoningText}
              </p>
            </div>
          )}

          {experienceRequirements.specificExperience && 
           experienceRequirements.specificExperience.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-lg font-semibold">Experiências Específicas Mencionadas</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                {experienceRequirements.specificExperience.map((experience, index) => (
                  <li key={index} className="leading-relaxed">
                    {experience}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {experienceRequirements.ambiguityFlags && 
           experienceRequirements.ambiguityFlags.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-lg font-semibold text-amber-700 dark:text-amber-400">
                Alertas de Ambiguidade
              </h4>
              <ul className="space-y-2">
                {experienceRequirements.ambiguityFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0">⚠️</span>
                    <span className="leading-relaxed">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-muted-foreground">
          Informações de experiência não disponíveis.
        </p>
      )}
    </div>
  );
}
