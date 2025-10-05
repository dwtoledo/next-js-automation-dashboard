import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnalysisData } from "@/lib/types";
import {
    JobDescriptionTab,
    SkillsAnalysisTab,
    DetailedScoreTab,
    ExperienceDetailsTab
} from "./tabs";

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
                <JobDescriptionTab jobDescription={jobDescription} />
            </TabsContent>

            <TabsContent value="skills" className="mt-6">
                <SkillsAnalysisTab keyTermsAnalysis={analysisData.keyTermsAnalysis} />
            </TabsContent>

            <TabsContent value="score" className="mt-6">
                <DetailedScoreTab categoryScores={analysisData.categoryScores} />
            </TabsContent>

            <TabsContent value="experience" className="mt-6">
                <ExperienceDetailsTab experienceRequirements={analysisData.experienceRequirements} />
            </TabsContent>
        </Tabs>
    );
}
