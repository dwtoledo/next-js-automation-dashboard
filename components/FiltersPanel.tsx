'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Search, Filter, X, Calendar, Sliders } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
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

    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
        searchParams.get('manualStatus')?.split(',').filter(Boolean) || []
    );
    const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>(
        searchParams.get('iaRecommendation')?.split(',').filter(Boolean) || []
    );
    const [selectedSeniorities, setSelectedSeniorities] = useState<string[]>(
        searchParams.get('seniority')?.split(',').filter(Boolean) || []
    );

    const [isExpanded, setIsExpanded] = useState(false);

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
        setSelectedStatuses([]);
        setSelectedRecommendations([]);
        setSelectedSeniorities([]);
        router.push(pathname, { scroll: false });
    };

    const hasActiveFilters =
        searchTerm ||
        compatibilityRange[0] !== 0 ||
        compatibilityRange[1] !== 100 ||
        experienceRange[0] !== 0 ||
        experienceRange[1] !== 20 ||
        dateFrom ||
        dateTo ||
        selectedStatuses.length > 0 ||
        selectedRecommendations.length > 0 ||
        selectedSeniorities.length > 0;

    return (
        <Card className="mb-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="text-sm"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Limpar filtros
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? 'Recolher' : 'Expandir'}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="search" className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Busca
                        </Label>
                        <Input
                            id="search"
                            type="text"
                            placeholder="Buscar por título, empresa ou descrição..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Status Manual</Label>
                        <div className="flex flex-wrap gap-2">
                            {filterConfigs.manualStatusFilters.map((option) => (
                                <Badge
                                    key={option.value}
                                    variant={
                                        selectedStatuses.includes(option.value) ? 'default' : 'outline'
                                    }
                                    className="cursor-pointer"
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
                    <div className="space-y-2">
                        <Label>Recomendação IA</Label>
                        <div className="flex flex-wrap gap-2">
                            {filterConfigs.iaRecommendationFilters.map((option) => (
                                <Badge
                                    key={option.value}
                                    variant={
                                        selectedRecommendations.includes(option.value)
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="cursor-pointer"
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
                    <div className="space-y-2">
                        <Label>Nível de Senioridade</Label>
                        <div className="flex flex-wrap gap-2">
                            {filterConfigs.seniorityLevelFilters.map((option) => (
                                <Badge
                                    key={option.value}
                                    variant={
                                        selectedSeniorities.includes(option.value) ? 'default' : 'outline'
                                    }
                                    className="cursor-pointer"
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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                                <Sliders className="h-4 w-4" />
                                Compatibilidade (%)
                            </Label>
                            <span className="text-sm text-muted-foreground">
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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Experiência (anos)</Label>
                            <span className="text-sm text-muted-foreground">
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
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Data de Criação
                        </Label>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => handleDateFromChange(e.target.value)}
                                />
                            </div>
                            <span className="text-gray-500">até</span>
                            <div className="flex-1">
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => handleDateToChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
