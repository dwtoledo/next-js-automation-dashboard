'use client';

import { useState, useEffect } from 'react';
import type { JobAnalysisRow } from '@/lib/types';
import JobsTable from '@/components/JobsTable';
import PaginationControls from '@/components/PaginationControls';
import DashboardActionPanel from '@/components/DashboardActionPanel';

interface DashboardClientWrapperProps {
  jobs: JobAnalysisRow[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

export default function DashboardClientWrapper({ 
  jobs, 
  totalPages, 
  totalCount, 
  currentPage 
}: DashboardClientWrapperProps) {
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedJobs(new Set());
  }, [jobs]);

  return (
    <div className="space-y-4 mt-4">
      <DashboardActionPanel 
        selectedJobIds={Array.from(selectedJobs)}
        onUpdateComplete={() => setSelectedJobs(new Set())}
      />
      
      <JobsTable 
        jobs={jobs}
        selectedJobs={selectedJobs}
        onSelectionChange={setSelectedJobs}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </div>
  );
}
