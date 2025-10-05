import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { AnalysisDataSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import { BackButton } from '@/components/BackButton';
import { JobDetailHeader } from '@/components/JobDetailHeader';
import { QuickVerdict } from '@/components/QuickVerdict';

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
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <BackButton>
            ← Voltar ao Dashboard
          </BackButton>
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
        />

        <div className="flex gap-3">
          <Button asChild>
            <a
              href={jobAnalysis.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver Vaga no LinkedIn
            </a>
          </Button>
          {jobAnalysis.recruiterUrl && (
            <Button asChild variant="outline">
              <a
                href={jobAnalysis.recruiterUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Perfil do Recrutador
              </a>
            </Button>
          )}
        </div>

        {analysisData?.location && analysisData?.workType && (
          <div className="flex items-center gap-4 text-lg text-muted-foreground">
            <span>{analysisData.location}</span>
            <span>•</span>
            <span>{analysisData.workType}</span>
          </div>
        )}

        <div className="bg-muted p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">✅ Dados Carregados com Sucesso</h2>
          <dl className="space-y-2">
            <div>
              <dt className="font-semibold inline">ID:</dt>
              <dd className="inline ml-2 text-muted-foreground">{jobAnalysis.id}</dd>
            </div>
            <div>
              <dt className="font-semibold inline">Título da Vaga:</dt>
              <dd className="inline ml-2">{jobAnalysis.jobTitle}</dd>
            </div>
            <div>
              <dt className="font-semibold inline">Empresa:</dt>
              <dd className="inline ml-2">{jobAnalysis.companyName}</dd>
            </div>
            <div>
              <dt className="font-semibold inline">Compatibilidade:</dt>
              <dd className="inline ml-2">{jobAnalysis.overallCompatibility}%</dd>
            </div>
            <div>
              <dt className="font-semibold inline">Status:</dt>
              <dd className="inline ml-2">{jobAnalysis.manualStatus}</dd>
            </div>
            <div>
              <dt className="font-semibold inline">Data de Criação:</dt>
              <dd className="inline ml-2">{new Date(jobAnalysis.createdAt).toLocaleDateString('pt-BR')}</dd>
            </div>
            <div>
              <dt className="font-semibold inline">AnalysisData Validado:</dt>
              <dd className="inline ml-2">{analysisData ? '✅ Sim' : '❌ Erro na validação'}</dd>
            </div>
          </dl>
        </div>
        {analysisData && (
          <div className="space-y-4">
            {analysisData.experienceRequirements && (
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="text-lg font-semibold mb-2">Requisitos de Experiência</h3>
                {analysisData.experienceRequirements.minimumYears && (
                  <p>Mínimo: {analysisData.experienceRequirements.minimumYears}+ anos</p>
                )}
                {analysisData.experienceRequirements.seniorityLevel && (
                  <p>Nível: {analysisData.experienceRequirements.seniorityLevel}</p>
                )}
              </div>
            )}

            {analysisData.summary?.recommendation && (
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="text-lg font-semibold mb-2">Recomendação da IA</h3>
                <p>{analysisData.summary.recommendation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
