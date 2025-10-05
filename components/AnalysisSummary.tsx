import { Card } from '@/components/ui/card';
import type { AnalysisSummary as AnalysisSummaryType } from '@/lib/types';
import { MessageSquareQuote, MessageSquareWarning, MessageSquareHeart } from 'lucide-react';

interface AnalysisSummaryProps {
  summary?: AnalysisSummaryType;
}

export function AnalysisSummary({ summary }: AnalysisSummaryProps) {
  if (!summary) {
    return null;
  }

  const hasContent =
    (summary.strengths && summary.strengths.length > 0) ||
    (summary.concerns && summary.concerns.length > 0) ||
    summary.reasoning;

  if (!hasContent) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Resumo da Análise:</h2>
      <div className="space-y-6">
        {summary.strengths && summary.strengths.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MessageSquareHeart className="h-5 w-5 text-green-600 dark:text-green-400" />
              Pontos Fortes
            </h3>
            <ul className="space-y-2">
              {summary.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0">
                    •
                  </span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {summary.concerns && summary.concerns.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MessageSquareWarning className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Pontos de Atenção
            </h3>
            <ul className="space-y-2">
              {summary.concerns.map((concern, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0">
                    •
                  </span>
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {summary.reasoning && (
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MessageSquareQuote className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-600 dark:text-blue-400">
                Raciocínio da IA
              </span>
            </h3>
            <p className="leading-relaxed text-foreground whitespace-pre-line">
              {summary.reasoning}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
