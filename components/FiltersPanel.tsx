'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Search, Filter, X, Calendar, Sliders } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { FilterOption } from '@/lib/types';

interface FiltersPanelProps {
    filterConfigs: {
        manualStatusFilters: FilterOption[];
        iaRecommendationFilters: FilterOption[];
        seniorityLevelFilters: FilterOption[];
    };
}

export default function FiltersPanel({ filterConfigs }: FiltersPanelProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [compatibilityRange, setCompatibilityRange] = useState<number[]>([
        Number(searchParams.get('minCompatibility') || 0),
        Number(searchParams.get('maxCompatibility') || 100),
    ]);
    const [experienceRange, setExperienceRange] = useState<number[]>([
        Number(searchParams.get('minExperience') || 0),
        Number(searchParams.get('maxExperience') || 20),
    ]);
    const [dateFrom, setDateFrom] = useState(searchParams.get('dateFrom') || '');
    const [dateTo, setDateTo] = useState(searchParams.get('dateTo') || '');

    const [isApplied, setIsApplied] = useState<boolean | undefined>(
        searchParams.get('isApplied') === 'true' ? true : 
        searchParams.get('isApplied') === 'false' ? false : 
        undefined
    );
    const [hasEasyApply, setHasEasyApply] = useState<boolean | undefined>(
        searchParams.get('hasEasyApply') === 'true' ? true : 
        searchParams.get('hasEasyApply') === 'false' ? false : 
        undefined
    );

    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
        searchParams.get('manualStatus')?.split(',').filter(Boolean) || ['PENDING']
    );
    const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>(
        searchParams.get('iaRecommendation')?.split(',').filter(Boolean) || []
    );
    const [selectedSeniorities, setSelectedSeniorities] = useState<string[]>(
        searchParams.get('seniority')?.split(',').filter(Boolean) || []
    );

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (!searchParams.get('manualStatus')) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('manualStatus', 'PENDING');
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, []);

    const updateURL = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (value && value !== '' && value !== '0' && value !== '100') {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            });

            params.delete('page');

            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    const debouncedSearch = useDebouncedCallback((value: string) => {
        updateURL({ search: value || null });
    }, 500);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const debouncedCompatibility = useDebouncedCallback((values: number[]) => {
        updateURL({
            minCompatibility: values[0] === 0 ? null : values[0].toString(),
            maxCompatibility: values[1] === 100 ? null : values[1].toString(),
        });
    }, 300);

    const handleCompatibilityChange = (values: number[]) => {
        setCompatibilityRange(values);
        debouncedCompatibility(values);
    };

    const debouncedExperience = useDebouncedCallback((values: number[]) => {
        updateURL({
            minExperience: values[0] === 0 ? null : values[0].toString(),
            maxExperience: values[1] === 20 ? null : values[1].toString(),
        });
    }, 300);

    const handleExperienceChange = (values: number[]) => {
        setExperienceRange(values);
        debouncedExperience(values);
    };

    const handleDateFromChange = (value: string) => {
        setDateFrom(value);
        updateURL({ dateFrom: value || null, dateTo: dateTo || null });
    };

    const handleDateToChange = (value: string) => {
        setDateTo(value);
        updateURL({ dateFrom: dateFrom || null, dateTo: value || null });
    };

    const handleIsAppliedChange = (checked: boolean | 'indeterminate') => {
        const newValue = checked === 'indeterminate' ? undefined : checked;
        setIsApplied(newValue);
        updateURL({ isApplied: newValue === undefined ? null : newValue.toString() });
    };

    const handleHasEasyApplyChange = (checked: boolean | 'indeterminate') => {
        const newValue = checked === 'indeterminate' ? undefined : checked;
        setHasEasyApply(newValue);
        updateURL({ hasEasyApply: newValue === undefined ? null : newValue.toString() });
    };

    const toggleStatus = (status: string) => {
        const newStatuses = selectedStatuses.includes(status)
            ? selectedStatuses.filter((s) => s !== status)
            : [...selectedStatuses, status];
        setSelectedStatuses(newStatuses);
        updateURL({ manualStatus: newStatuses.length > 0 ? newStatuses.join(',') : null });
    };

    const toggleRecommendation = (recommendation: string) => {
        const newRecommendations = selectedRecommendations.includes(recommendation)
            ? selectedRecommendations.filter((r) => r !== recommendation)
            : [...selectedRecommendations, recommendation];
        setSelectedRecommendations(newRecommendations);
        updateURL({
            iaRecommendation: newRecommendations.length > 0 ? newRecommendations.join(',') : null,
        });
    };

    const toggleSeniority = (seniority: string) => {
        const newSeniorities = selectedSeniorities.includes(seniority)
            ? selectedSeniorities.filter((s) => s !== seniority)
            : [...selectedSeniorities, seniority];
        setSelectedSeniorities(newSeniorities);
        updateURL({ seniority: newSeniorities.length > 0 ? newSeniorities.join(',') : null });
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setCompatibilityRange([0, 100]);
        setExperienceRange([0, 20]);
        setDateFrom('');
        setDateTo('');
        setIsApplied(undefined);
        setHasEasyApply(undefined);
        setSelectedStatuses(['PENDING']);
        setSelectedRecommendations([]);
        setSelectedSeniorities([]);
        const params = new URLSearchParams();
        params.set('manualStatus', 'PENDING');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const hasActiveFilters =
        searchTerm ||
        compatibilityRange[0] !== 0 ||
        compatibilityRange[1] !== 100 ||
        experienceRange[0] !== 0 ||
        experienceRange[1] !== 20 ||
        dateFrom ||
        dateTo ||
        isApplied !== undefined ||
        hasEasyApply !== undefined ||
        !(selectedStatuses.length === 1 && selectedStatuses[0] === 'PENDING') ||
        selectedRecommendations.length > 0 ||
        selectedSeniorities.length > 0;

    return (
        <Card className="mb-6">
            <CardHeader className={isExpanded ? "pb-0" : ""}>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Filter className="h-4 w-4" />
                        Filtros
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="text-sm h-8"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Limpar
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-8"
                        >
                            {isExpanded ? 'Recolher' : 'Expandir'}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-5 pt-6 pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="search" className="flex items-center gap-1.5 text-sm">
                                <Search className="h-3.5 w-3.5" />
                                Busca
                            </Label>
                            <Input
                                id="search"
                                type="text"
                                placeholder="Buscar por título, empresa ou descrição..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="h-9"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 text-sm">
                                <Calendar className="h-3.5 w-3.5" />
                                Datas
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => handleDateFromChange(e.target.value)}
                                    className="h-9"
                                />
                                <span className="text-xs text-muted-foreground">até</span>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => handleDateToChange(e.target.value)}
                                    className="h-9"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isApplied"
                                checked={isApplied === true}
                                onCheckedChange={(checked) => {
                                    if (checked === true) {
                                        handleIsAppliedChange(true);
                                    } else if (isApplied === true) {
                                        handleIsAppliedChange('indeterminate');
                                    }
                                }}
                            />
                            <label
                                htmlFor="isApplied"
                                className="text-sm leading-none cursor-pointer"
                            >
                                Apenas vagas já aplicadas
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="hasEasyApply"
                                checked={hasEasyApply === true}
                                onCheckedChange={(checked) => {
                                    if (checked === true) {
                                        handleHasEasyApplyChange(true);
                                    } else if (hasEasyApply === true) {
                                        handleHasEasyApplyChange('indeterminate');
                                    }
                                }}
                            />
                            <label
                                htmlFor="hasEasyApply"
                                className="text-sm leading-none cursor-pointer"
                            >
                                Apenas vagas com Easy Apply
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="rounded-lg border bg-card p-5 space-y-3">
                            <Label className="text-sm font-semibold">Status</Label>
                            <div className="flex flex-wrap gap-2">
                                {filterConfigs.manualStatusFilters.map((option) => (
                                    <Badge
                                        key={option.value}
                                        variant={
                                            selectedStatuses.includes(option.value) ? 'default' : 'outline'
                                        }
                                        className="cursor-pointer text-xs"
                                        onClick={() => toggleStatus(option.value)}
                                        style={
                                            selectedStatuses.includes(option.value)
                                                ? { backgroundColor: option.color.split('bg-')[1]?.split(' ')[0] }
                                                : {}
                                        }
                                    >
                                        {option.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-5 space-y-3">
                            <Label className="text-sm font-semibold">Recomendação da IA</Label>
                            <div className="flex flex-wrap gap-2">
                                {filterConfigs.iaRecommendationFilters.map((option) => (
                                    <Badge
                                        key={option.value}
                                        variant={
                                            selectedRecommendations.includes(option.value)
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className="cursor-pointer text-xs"
                                        onClick={() => toggleRecommendation(option.value)}
                                        style={
                                            selectedRecommendations.includes(option.value)
                                                ? { backgroundColor: option.color.split('bg-')[1]?.split(' ')[0] }
                                                : {}
                                        }
                                    >
                                        {option.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-5 space-y-3">
                            <Label className="text-sm font-semibold">Nível de Senioridade</Label>
                            <div className="flex flex-wrap gap-2">
                                {filterConfigs.seniorityLevelFilters.map((option) => (
                                    <Badge
                                        key={option.value}
                                        variant={
                                            selectedSeniorities.includes(option.value) ? 'default' : 'outline'
                                        }
                                        className="cursor-pointer text-xs"
                                        onClick={() => toggleSeniority(option.value)}
                                        style={
                                            selectedSeniorities.includes(option.value)
                                                ? { backgroundColor: option.color.split('bg-')[1]?.split(' ')[0] }
                                                : {}
                                        }
                                    >
                                        {option.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-1.5 text-sm">
                                    <Sliders className="h-3.5 w-3.5" />
                                    Compatibilidade
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    {compatibilityRange[0]}% - {compatibilityRange[1]}%
                                </span>
                            </div>
                            <Slider
                                min={0}
                                max={100}
                                step={5}
                                value={compatibilityRange}
                                onValueChange={handleCompatibilityChange}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Experiência</Label>
                                <span className="text-xs text-muted-foreground">
                                    {experienceRange[0]} - {experienceRange[1]} anos
                                </span>
                            </div>
                            <Slider
                                min={0}
                                max={20}
                                step={1}
                                value={experienceRange}
                                onValueChange={handleExperienceChange}
                                className="w-full"
                            />
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
