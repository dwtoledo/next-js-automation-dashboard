import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { AnalysisData } from "@/lib/types";
import { getScoreColorVariant, formatCategoryName, getConfidenceLevelVariant } from "@/lib/utils";
import { PROGRESS_BAR_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DetailedAnalysisTabsProps {
  analysisData: AnalysisData;
  jobDescription: string | null;
}

export function DetailedAnalysisTabs({ analysisData, jobDescription }: DetailedAnalysisTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="description">Descrição Original</TabsTrigger>
        <TabsTrigger value="skills">Análise de Skills</TabsTrigger>
        <TabsTrigger value="score">Score Detalhado</TabsTrigger>
        <TabsTrigger value="experience">Experiência Detalhada</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Descrição da Vaga</h3>
          {jobDescription ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {jobDescription}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              Descrição da vaga não disponível.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="skills" className="mt-6">
        <div className="bg-card p-6 rounded-lg border space-y-6">
          <h3 className="text-xl font-semibold mb-4">Análise de Skills</h3>
          
          {analysisData.keyTermsAnalysis ? (
            <>
              <div>
                <h4 className="text-lg font-medium mb-3">Requisitos da Vaga</h4>
                {analysisData.keyTermsAnalysis.jobRequired && analysisData.keyTermsAnalysis.jobRequired.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisData.keyTermsAnalysis.jobRequired.map((term, index) => (
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
                {analysisData.keyTermsAnalysis.candidateHas && analysisData.keyTermsAnalysis.candidateHas.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisData.keyTermsAnalysis.candidateHas.map((term, index) => (
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
                {analysisData.keyTermsAnalysis.missing && analysisData.keyTermsAnalysis.missing.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisData.keyTermsAnalysis.missing.map((term, index) => (
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
                {analysisData.keyTermsAnalysis.bonus && analysisData.keyTermsAnalysis.bonus.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisData.keyTermsAnalysis.bonus.map((term, index) => (
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
      </TabsContent>

      <TabsContent value="score" className="mt-6">
        <div className="bg-card p-6 rounded-lg border space-y-6">
          <h3 className="text-xl font-semibold mb-4">Score Detalhado</h3>
          
          {analysisData.categoryScores && Object.keys(analysisData.categoryScores).length > 0 ? (
            <>
              {Object.entries(analysisData.categoryScores).map(([key, category]) => {
                const colorVariant = getScoreColorVariant(category.score);
                const progressBarClass = PROGRESS_BAR_CLASSES[colorVariant];
                
                return (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium">{formatCategoryName(key)}</h4>
                      <span className="text-sm font-semibold">
                        {category.score}%
                      </span>
                    </div>
                    
                    <Progress 
                      value={category.score} 
                      className={cn("h-3", progressBarClass)}
                    />
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {category.breakdown}
                    </p>
                  </div>
                );
              })}
            </>
          ) : (
            <p className="text-muted-foreground">
              Score detalhado não disponível.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="experience" className="mt-6">
        <div className="bg-card p-6 rounded-lg border space-y-6">
          <h3 className="text-xl font-semibold mb-4">Experiência Detalhada</h3>
          
          {analysisData.experienceRequirements ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisData.experienceRequirements.minimumYears !== undefined && (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Anos Mínimos Requeridos
                    </p>
                    <p className="text-base text-muted-foreground">
                      {analysisData.experienceRequirements.minimumYears} {analysisData.experienceRequirements.minimumYears === 1 ? 'ano' : 'anos'}
                    </p>
                  </div>
                )}
                {analysisData.experienceRequirements.preferredYears !== undefined && (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Anos Preferíveis
                    </p>
                    <p className="text-base text-muted-foreground">
                      {analysisData.experienceRequirements.preferredYears} {analysisData.experienceRequirements.preferredYears === 1 ? 'ano' : 'anos'}
                    </p>
                  </div>
                )}
                {analysisData.experienceRequirements.seniorityLevel && (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Nível de Senioridade
                    </p>
                    <p className="text-base text-muted-foreground">
                      {analysisData.experienceRequirements.seniorityLevel}
                    </p>
                  </div>
                )}
                {analysisData.experienceRequirements.inferenceSource && (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Fonte da Informação
                    </p>
                    <p className="text-base text-muted-foreground">
                      {analysisData.experienceRequirements.inferenceSource}
                    </p>
                  </div>
                )}
                {analysisData.experienceRequirements.confidenceLevel && (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Nível de Confiança da IA
                    </p>
                    <div>
                      <Badge variant={getConfidenceLevelVariant(analysisData.experienceRequirements.confidenceLevel)}>
                        {analysisData.experienceRequirements.confidenceLevel}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
              {analysisData.experienceRequirements.reasoningText && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-lg font-semibold">Raciocínio da Análise</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {analysisData.experienceRequirements.reasoningText}
                  </p>
                </div>
              )}
              {analysisData.experienceRequirements.specificExperience && 
               analysisData.experienceRequirements.specificExperience.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-lg font-semibold">Experiências Específicas Mencionadas</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {analysisData.experienceRequirements.specificExperience.map((experience, index) => (
                      <li key={index} className="leading-relaxed">
                        {experience}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysisData.experienceRequirements.ambiguityFlags && 
               analysisData.experienceRequirements.ambiguityFlags.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-lg font-semibold text-amber-700 dark:text-amber-400">
                    Alertas de Ambiguidade
                  </h4>
                  <ul className="space-y-2">
                    {analysisData.experienceRequirements.ambiguityFlags.map((flag, index) => (
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
      </TabsContent>
    </Tabs>
  );
}
