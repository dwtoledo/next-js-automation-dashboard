import { Progress } from "@/components/ui/progress";
import type { AnalysisData } from "@/lib/types";
import { getScoreColorVariant, formatCategoryName } from "@/lib/utils";
import { PROGRESS_BAR_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DetailedScoreTabProps {
  categoryScores: AnalysisData['categoryScores'];
}

export function DetailedScoreTab({ categoryScores }: DetailedScoreTabProps) {
  return (
    <div className="bg-card p-6 rounded-lg border space-y-6">
      <h3 className="text-xl font-semibold mb-4">Score Detalhado</h3>
      
      {categoryScores && Object.keys(categoryScores).length > 0 ? (
        <>
          {Object.entries(categoryScores).map(([key, category]) => {
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
  );
}
