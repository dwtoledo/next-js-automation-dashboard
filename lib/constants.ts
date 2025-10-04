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
    label: 'Entry',
    color: BADGE_COLORS.cyan,
  },
  {
    value: 'Junior',
    label: 'Junior',
    color: BADGE_COLORS.sky,
  },
  {
    value: 'Mid',
    label: 'Mid',
    color: BADGE_COLORS.blue,
  },
  {
    value: 'Senior',
    label: 'Senior',
    color: BADGE_COLORS.violet,
  },
  {
    value: 'Lead',
    label: 'Lead',
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
