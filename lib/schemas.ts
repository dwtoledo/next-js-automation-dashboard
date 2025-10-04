import { z } from 'zod';

const ExperienceRequirementsSchema = z.object({
  minimumYears: z.number().optional(),
  seniorityLevel: z.string().optional(),
  requiredSkills: z.array(z.string()).optional(),
  preferredSkills: z.array(z.string()).optional(),
});

const SummarySchema = z.object({
  recommendation: z.string().optional(),
  keyPoints: z.array(z.string()).optional(),
  strengths: z.array(z.string()).optional(),
  concerns: z.array(z.string()).optional(),
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
});

export type AnalysisData = z.infer<typeof AnalysisDataSchema>;
