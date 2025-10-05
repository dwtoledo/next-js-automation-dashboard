import { Badge } from "@/components/ui/badge";
import type { AnalysisData } from "@/lib/types";

interface SkillsAnalysisTabProps {
  keyTermsAnalysis: AnalysisData['keyTermsAnalysis'];
}

export function SkillsAnalysisTab({ keyTermsAnalysis }: SkillsAnalysisTabProps) {
  return (
    <div className="bg-card p-6 rounded-lg border space-y-6">
      <h3 className="text-xl font-semibold mb-4">Análise de Skills</h3>
      
      {keyTermsAnalysis ? (
        <>
          <div>
            <h4 className="text-lg font-medium mb-3">Requisitos da Vaga</h4>
            {keyTermsAnalysis.jobRequired && keyTermsAnalysis.jobRequired.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keyTermsAnalysis.jobRequired.map((term, index) => (
                  <Badge key={index} variant="blue">
                    {term}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Nenhuma skill nesta categoria
              </p>
            )}
          </div>

          <div>
            <h4 className="text-lg font-medium mb-3">Suas Skills</h4>
            {keyTermsAnalysis.candidateHas && keyTermsAnalysis.candidateHas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keyTermsAnalysis.candidateHas.map((term, index) => (
                  <Badge key={index} variant="green">
                    {term}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Nenhuma skill nesta categoria
              </p>
            )}
          </div>

          <div>
            <h4 className="text-lg font-medium mb-3">Skills Faltantes</h4>
            {keyTermsAnalysis.missing && keyTermsAnalysis.missing.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keyTermsAnalysis.missing.map((term, index) => (
                  <Badge key={index} variant="red">
                    {term}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Nenhuma skill nesta categoria
              </p>
            )}
          </div>

          <div>
            <h4 className="text-lg font-medium mb-3">Skills Bônus</h4>
            {keyTermsAnalysis.bonus && keyTermsAnalysis.bonus.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keyTermsAnalysis.bonus.map((term, index) => (
                  <Badge key={index} variant="amber">
                    {term}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Nenhuma skill nesta categoria
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">
          Análise de skills não disponível.
        </p>
      )}
    </div>
  );
}
