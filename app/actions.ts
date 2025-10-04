'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { ManualStatus } from '@prisma/client';

export async function updateJobStatus(id: string, newStatus: ManualStatus) {
  try {    
    const result = await prisma.jobAnalysis.update({
      where: {
        id,
      },
      data: {
        manualStatus: newStatus,
        manualDecisionAt: new Date(),
      },
    });

    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error updating job status:', error);
    return { success: false, error: 'Failed to update job status' };
  }
}
