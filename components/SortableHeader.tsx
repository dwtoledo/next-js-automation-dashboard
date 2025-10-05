'use client';

import { TableHead } from '@/components/ui/table';
import { useSearchParams } from 'next/navigation';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface SortableHeaderProps {
  field: string;
  children: ReactNode;
  className?: string;
  onSort: (field: string) => void;
}

export default function SortableHeader({ field, children, className, onSort }: SortableHeaderProps) {
  const searchParams = useSearchParams();

  const getSortIcon = () => {
    const currentSortBy = searchParams.get('sortBy');
    const currentSortOrder = searchParams.get('sortOrder');

    if (currentSortBy !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 inline" />;
    }

    return currentSortOrder === 'asc'
      ? <ArrowUp className="ml-1 h-4 w-4 inline" />
      : <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  return (
    <TableHead
      className={`cursor-pointer hover:bg-gray-50 select-none text-center ${className || ''}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center justify-center">
        {children}
        {getSortIcon()}
      </div>
    </TableHead>
  );
}
