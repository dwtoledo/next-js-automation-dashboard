import { z } from 'zod';

const InferenceSourceEnum = z.enum(['Explicit', 'Title', 'Responsibilities', 'Context', 'Unknown']);
const ConfidenceLevelEnum = z.enum(['High', 'Medium', 'Low', 'None']);
const SeniorityLevelEnum = z.enum(['Entry', 'Junior', 'Mid', 'Senior', 'Lead', 'Principal', 'Unknown']);
const RecommendationEnum = z.enum(['advance', 'reject', 'evaluate_with_reservations']);

const ExperienceRequirementsSchema = z.object({
  minimumYears: z.number().optional(),
  preferredYears: z.number().optional(),
  seniorityLevel: SeniorityLevelEnum.optional(),
  inferenceSource: InferenceSourceEnum.optional(),
  confidenceLevel: ConfidenceLevelEnum.optional(),
  reasoningText: z.string().optional(),
  specificExperience: z.array(z.string()).optional(),
  ambiguityFlags: z.array(z.string()).optional(),
  requiredSkills: z.array(z.string()).optional(),
  preferredSkills: z.array(z.string()).optional(),
});

const SummarySchema = z.object({
  recommendation: RecommendationEnum.optional(),
  keyPoints: z.array(z.string()).optional(),
  strengths: z.array(z.string()).optional(),
  concerns: z.array(z.string()).optional(),
  reasoning: z.string().optional(),
});

const KeyTermsAnalysisSchema = z.object({
  jobRequired: z.array(z.string()).optional().default([]),
  candidateHas: z.array(z.string()).optional().default([]),
  missing: z.array(z.string()).optional().default([]),
  bonus: z.array(z.string()).optional().default([]),
});

const CategoryScoreSchema = z.object({
  score: z.number(),
  breakdown: z.string(),
});

export const AnalysisDataSchema = z.object({
  experienceRequirements: ExperienceRequirementsSchema.optional(),
  summary: SummarySchema.optional(),
  technicalRequirements: z.record(z.string(), z.unknown()).optional(),
  benefits: z.array(z.string()).optional(),
  location: z.string().optional(),
  workType: z.string().optional(),
  salary: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().optional(),
  }).optional(),
  keyTermsAnalysis: KeyTermsAnalysisSchema.optional(),
  categoryScores: z.record(z.string(), CategoryScoreSchema).optional(),
});

export type AnalysisData = z.infer<typeof AnalysisDataSchema>;
export type InferenceSource = z.infer<typeof InferenceSourceEnum>;
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelEnum>;
export type SeniorityLevel = z.infer<typeof SeniorityLevelEnum>;
export type Recommendation = z.infer<typeof RecommendationEnum>;
