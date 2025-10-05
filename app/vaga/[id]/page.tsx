import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { AnalysisDataSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import { BackButton } from '@/components/BackButton';
import { JobDetailHeader } from '@/components/JobDetailHeader';
import { QuickVerdict } from '@/components/QuickVerdict';
import { AnalysisSummary } from '@/components/AnalysisSummary';
import { DetailedAnalysisTabs } from '@/components/DetailedAnalysisTabs';
import { Linkedin, User } from 'lucide-react';

interface JobDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: JobDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const jobAnalysis = await prisma.jobAnalysis.findUniqueOrThrow({
      where: { id },
      select: {
        jobTitle: true,
        companyName: true,
      },
    });

    return {
      title: `${jobAnalysis.jobTitle} - ${jobAnalysis.companyName}`,
      description: `Detalhes da vaga de ${jobAnalysis.jobTitle} na empresa ${jobAnalysis.companyName}`,
    };
  } catch {
    return {
      title: 'Vaga não encontrada',
      description: 'A vaga solicitada não foi encontrada',
    };
  }
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;

  let jobAnalysis;
  try {
    jobAnalysis = await prisma.jobAnalysis.findUniqueOrThrow({
      where: { id },
    });
  } catch (error) {
    console.error('Job not found:', error);
    notFound();
  }

  let analysisData;
  try {
    analysisData = AnalysisDataSchema.parse(jobAnalysis.analysisData);
  } catch (error) {
    console.error('Invalid analysisData structure:', error);
    analysisData = null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-start gap-3">
          <BackButton>
            ← Voltar ao Dashboard
          </BackButton>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm">
              <a
                href={jobAnalysis.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                Ver no LinkedIn
              </a>
            </Button>
            {jobAnalysis.recruiterUrl && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={jobAnalysis.recruiterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Ver Recrutador
                </a>
              </Button>
            )}
          </div>
        </div>
        
        <JobDetailHeader
          jobTitle={jobAnalysis.jobTitle}
          companyName={jobAnalysis.companyName}
          manualStatus={jobAnalysis.manualStatus}
          hasEasyApply={jobAnalysis.hasEasyApply}
          createdAt={jobAnalysis.createdAt}
          updatedAt={jobAnalysis.updatedAt}
        />

        <QuickVerdict
          overallCompatibility={jobAnalysis.overallCompatibility}
          recommendation={analysisData?.summary?.recommendation}
          experienceRequirements={analysisData?.experienceRequirements}
          jobId={jobAnalysis.id}
          initialManualStatus={jobAnalysis.manualStatus}
          initialManualNotes={jobAnalysis.manualNotes}
        />

        <AnalysisSummary summary={analysisData?.summary} />

        {analysisData?.location && analysisData?.workType && (
          <div className="flex items-center gap-4 text-lg text-muted-foreground">
            <span>{analysisData.location}</span>
            <span>•</span>
            <span>{analysisData.workType}</span>
          </div>
        )}

        {analysisData && (
          <DetailedAnalysisTabs 
            analysisData={analysisData} 
            jobDescription={jobAnalysis.jobDescription}
          />
        )}
      </div>
    </div>
  );
}
