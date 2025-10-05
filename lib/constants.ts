import type { FilterOption } from './types';

export const BADGE_COLORS = {
  default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
  secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
  destructive:
    "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
  outline:
    "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
  yellow: 'border-transparent bg-yellow-100 text-yellow-800 [a&]:hover:bg-yellow-200',
  gray: 'border-transparent bg-gray-100 text-gray-800 [a&]:hover:bg-gray-200',
  green: 'border-transparent bg-green-100 text-green-800 [a&]:hover:bg-green-200',
  blue: 'border-transparent bg-blue-100 text-blue-800 [a&]:hover:bg-blue-200',
  red: 'border-transparent bg-red-100 text-red-800 [a&]:hover:bg-red-200',
  purple: 'border-transparent bg-purple-100 text-purple-800 [a&]:hover:bg-purple-200',
  emerald: 'border-transparent bg-emerald-100 text-emerald-800 [a&]:hover:bg-emerald-200',
  indigo: 'border-transparent bg-indigo-100 text-indigo-800 [a&]:hover:bg-indigo-200',
  orange: 'border-transparent bg-orange-100 text-orange-800 [a&]:hover:bg-orange-200',
  amber: 'border-transparent bg-amber-100 text-amber-800 [a&]:hover:bg-amber-200',
  cyan: 'border-transparent bg-cyan-100 text-cyan-800 [a&]:hover:bg-cyan-200',
  sky: 'border-transparent bg-sky-100 text-sky-800 [a&]:hover:bg-sky-200',
  violet: 'border-transparent bg-violet-100 text-violet-800 [a&]:hover:bg-violet-200',
  fuchsia: 'border-transparent bg-fuchsia-100 text-fuchsia-800 [a&]:hover:bg-fuchsia-200',
  'outline-green': 'border-green-500 text-green-700 [a&]:hover:bg-green-50',
  'outline-red': 'border-red-500 text-red-700 [a&]:hover:bg-red-50',
  'outline-amber': 'border-amber-500 text-amber-700 [a&]:hover:bg-amber-50',
  'outline-gray': 'border-gray-400 text-gray-600 [a&]:hover:bg-gray-50',
  'outline-yellow': 'border-yellow-500 text-yellow-700 [a&]:hover:bg-yellow-50',
  'outline-blue': 'border-blue-500 text-blue-700 [a&]:hover:bg-blue-50',
  'outline-purple': 'border-purple-500 text-purple-700 [a&]:hover:bg-purple-50',
  'outline-indigo': 'border-indigo-500 text-indigo-700 [a&]:hover:bg-indigo-50',
  'outline-emerald': 'border-emerald-500 text-emerald-700 [a&]:hover:bg-emerald-50',
  'outline-orange': 'border-orange-500 text-orange-700 [a&]:hover:bg-orange-50',
} as const;

export type BadgeVariant = keyof typeof BADGE_COLORS | 'default' | 'secondary' | 'destructive' | 'outline';

export const STATUS_VARIANT_MAP: Record<string, BadgeVariant> = {
  PENDING: 'yellow',
  IGNORED: 'gray',
  INTERESTED: 'blue',
  APPLIED: 'green',
  REJECTED: 'red',
  INTERVIEW: 'purple',
  OFFER: 'indigo',
  ACCEPTED: 'emerald',
  DECLINED: 'orange',
} as const;

export const RECOMMENDATION_VARIANT_MAP: Record<string, BadgeVariant> = {
  advance: 'green',
  reject: 'red',
  evaluate_with_reservations: 'amber',
} as const;

export const SENIORITY_VARIANT_MAP: Record<string, BadgeVariant> = {
  Entry: 'cyan',
  Junior: 'sky',
  Mid: 'blue',
  Senior: 'violet',
  Lead: 'purple',
  Principal: 'fuchsia',
  Unknown: 'gray',
} as const;

export const INFERENCE_SOURCE_VARIANT_MAP: Record<string, BadgeVariant> = {
  Explicit: 'green',
  Title: 'blue',
  Responsibilities: 'purple',
  Context: 'amber',
  Unknown: 'gray',
} as const;

export const CONFIDENCE_LEVEL_VARIANT_MAP: Record<string, BadgeVariant> = {
  High: 'green',
  Medium: 'amber',
  Low: 'orange',
  None: 'gray',
} as const;

export const MANUAL_STATUS_FILTERS: FilterOption[] = [
  {
    value: 'PENDING',
    label: 'Pendente',
    color: BADGE_COLORS.yellow,
  },
  {
    value: 'IGNORED',
    label: 'Ignorado',
    color: BADGE_COLORS.gray,
  },
  {
    value: 'INTERESTED',
    label: 'Interessado',
    color: BADGE_COLORS.blue,
  },
  {
    value: 'APPLIED',
    label: 'Aplicado',
    color: BADGE_COLORS.green,
  },
  {
    value: 'REJECTED',
    label: 'Rejeitado',
    color: BADGE_COLORS.red,
  },
  {
    value: 'INTERVIEW',
    label: 'Entrevista',
    color: BADGE_COLORS.purple,
  },
  {
    value: 'OFFER',
    label: 'Oferta',
    color: BADGE_COLORS.indigo,
  },
  {
    value: 'ACCEPTED',
    label: 'Aceito',
    color: BADGE_COLORS.emerald,
  },
  {
    value: 'DECLINED',
    label: 'Recusado',
    color: BADGE_COLORS.orange,
  },
];

export const IA_RECOMMENDATION_FILTERS: FilterOption[] = [
  {
    value: 'advance',
    label: 'Avançar',
    color: BADGE_COLORS.green,
  },
  {
    value: 'reject',
    label: 'Rejeitar',
    color: BADGE_COLORS.red,
  },
  {
    value: 'evaluate_with_reservations',
    label: 'Avaliar com reservas',
    color: BADGE_COLORS.amber,
  },
];

export const SENIORITY_LEVEL_FILTERS: FilterOption[] = [
  {
    value: 'Entry',
    label: 'Iniciante',
    color: BADGE_COLORS.cyan,
  },
  {
    value: 'Junior',
    label: 'Júnior',
    color: BADGE_COLORS.sky,
  },
  {
    value: 'Mid',
    label: 'Pleno',
    color: BADGE_COLORS.blue,
  },
  {
    value: 'Senior',
    label: 'Sênior',
    color: BADGE_COLORS.violet,
  },
  {
    value: 'Lead',
    label: 'Líder',
    color: BADGE_COLORS.purple,
  },
  {
    value: 'Principal',
    label: 'Principal',
    color: BADGE_COLORS.fuchsia,
  },
  {
    value: 'Unknown',
    label: 'Desconhecido',
    color: BADGE_COLORS.gray,
  },
];

export const INFERENCE_SOURCE_FILTERS: FilterOption[] = [
  {
    value: 'Explicit',
    label: 'Explícito',
    color: BADGE_COLORS.green,
  },
  {
    value: 'Title',
    label: 'Título',
    color: BADGE_COLORS.blue,
  },
  {
    value: 'Responsibilities',
    label: 'Responsabilidades',
    color: BADGE_COLORS.purple,
  },
  {
    value: 'Context',
    label: 'Contexto',
    color: BADGE_COLORS.amber,
  },
  {
    value: 'Unknown',
    label: 'Desconhecido',
    color: BADGE_COLORS.gray,
  },
];

export const CONFIDENCE_LEVEL_FILTERS: FilterOption[] = [
  {
    value: 'High',
    label: 'Alta',
    color: BADGE_COLORS.green,
  },
  {
    value: 'Medium',
    label: 'Média',
    color: BADGE_COLORS.amber,
  },
  {
    value: 'Low',
    label: 'Baixa',
    color: BADGE_COLORS.orange,
  },
  {
    value: 'None',
    label: 'Nenhuma',
    color: BADGE_COLORS.gray,
  },
];

export const TOAST_CLASS_NAMES = {
  toast: "group-[.toaster]:border-border group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-lg",
  description: "group-[.toast]:text-muted-foreground",
  actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
  cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
  success: "group-[.toaster]:!bg-green-50 group-[.toaster]:!text-green-900 group-[.toaster]:!border-green-200 dark:group-[.toaster]:!bg-green-950 dark:group-[.toaster]:!text-green-100 dark:group-[.toaster]:!border-green-800 [&_[data-description]]:!text-green-800 dark:[&_[data-description]]:!text-green-200",
  error: "group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-900 group-[.toaster]:!border-red-200 dark:group-[.toaster]:!bg-red-950 dark:group-[.toaster]:!text-red-100 dark:group-[.toaster]:!border-red-800 [&_[data-description]]:!text-red-800 dark:[&_[data-description]]:!text-red-200",
} as const;

export const TEXT_COLOR_CLASSES: Record<BadgeVariant, string> = {
  default: 'text-gray-800 dark:text-gray-200',
  secondary: 'text-gray-800 dark:text-gray-200',
  destructive: 'text-red-800 dark:text-red-200',
  outline: 'text-gray-800 dark:text-gray-200',
  red: 'text-red-800 dark:text-red-200',
  orange: 'text-orange-800 dark:text-orange-200',
  yellow: 'text-yellow-800 dark:text-yellow-200',
  green: 'text-green-800 dark:text-green-200',
  blue: 'text-blue-800 dark:text-blue-200',
  purple: 'text-purple-800 dark:text-purple-200',
  emerald: 'text-emerald-800 dark:text-emerald-200',
  indigo: 'text-indigo-800 dark:text-indigo-200',
  amber: 'text-amber-800 dark:text-amber-200',
  cyan: 'text-cyan-800 dark:text-cyan-200',
  sky: 'text-sky-800 dark:text-sky-200',
  violet: 'text-violet-800 dark:text-violet-200',
  fuchsia: 'text-fuchsia-800 dark:text-fuchsia-200',
  gray: 'text-gray-800 dark:text-gray-200',
  'outline-green': 'text-green-700 dark:text-green-300',
  'outline-red': 'text-red-700 dark:text-red-300',
  'outline-amber': 'text-amber-700 dark:text-amber-300',
  'outline-gray': 'text-gray-600 dark:text-gray-400',
  'outline-yellow': 'text-yellow-700 dark:text-yellow-300',
  'outline-blue': 'text-blue-700 dark:text-blue-300',
  'outline-purple': 'text-purple-700 dark:text-purple-300',
  'outline-indigo': 'text-indigo-700 dark:text-indigo-300',
  'outline-emerald': 'text-emerald-700 dark:text-emerald-300',
  'outline-orange': 'text-orange-700 dark:text-orange-300',
} as const;

export const PROGRESS_BAR_CLASSES: Record<string, string> = {
  red: '[&>div]:bg-red-500 bg-red-100 dark:[&>div]:bg-red-600 dark:bg-red-950',
  orange: '[&>div]:bg-orange-500 bg-orange-100 dark:[&>div]:bg-orange-600 dark:bg-orange-950',
  yellow: '[&>div]:bg-yellow-500 bg-yellow-100 dark:[&>div]:bg-yellow-600 dark:bg-yellow-950',
  green: '[&>div]:bg-green-500 bg-green-100 dark:[&>div]:bg-green-600 dark:bg-green-950',
  blue: '[&>div]:bg-blue-500 bg-blue-100 dark:[&>div]:bg-blue-600 dark:bg-blue-950',
  purple: '[&>div]:bg-purple-500 bg-purple-100 dark:[&>div]:bg-purple-600 dark:bg-purple-950',
  gray: '[&>div]:bg-gray-500 bg-gray-100 dark:[&>div]:bg-gray-600 dark:bg-gray-950',
} as const;

export const COMPATIBILITY_SCORE_RANGES = [
  { max: 50, variant: 'red' as BadgeVariant },
  { max: 65, variant: 'orange' as BadgeVariant },
  { max: 80, variant: 'yellow' as BadgeVariant },
  { max: 100, variant: 'green' as BadgeVariant },
] as const;

export function getCompatibilityVariant(score: number): BadgeVariant {
  const range = COMPATIBILITY_SCORE_RANGES.find(r => score < r.max);
  return range?.variant || 'green';
}

export const DONUT_CHART_COLORS = {
  red: {
    stroke: '#ef4444',
    text: 'text-red-800',
    bg: 'bg-red-50'
  },
  orange: {
    stroke: '#f97316',
    text: 'text-orange-800',
    bg: 'bg-orange-50'
  },
  yellow: {
    stroke: '#eab308',
    text: 'text-yellow-800',
    bg: 'bg-yellow-50'
  },
  green: {
    stroke: '#22c55e',
    text: 'text-green-800',
    bg: 'bg-green-50'
  },
} as const;

export const HEADER_CONFIG: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard de Vagas",
    description: "Gerencie e analise as vagas pendentes de análise",
  },
  default: {
    title: "LinkedIn Job Automation",
    description: "Projeto para automação de análises de vagas no LinkedIn.",
  },
} as const;

export const DATE_FORMATS = {
  FULL_DATE_TIME: "dd 'de' MMMM 'de' yyyy 'às' HH:mm'hrs'",
  SHORT_DATE: "dd/MM/yyyy",
  DATE_WITH_TIME: "dd/MM/yyyy 'às' HH:mm",
} as const;
