'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { ManualStatus } from '@prisma/client';

export async function updateJobStatus(id: string, newStatus: ManualStatus) {
  try {    
    await prisma.jobAnalysis.update({
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

interface UpdateJobDetailsParams {
  id: string;
  manualStatus?: ManualStatus;
  manualNotes?: string;
}

export async function updateJobDetails({ id, manualStatus, manualNotes }: UpdateJobDetailsParams) {
  try {
    const updateData: {
      manualStatus?: ManualStatus;
      manualNotes?: string;
      manualDecisionAt?: Date;
    } = {};

    if (manualStatus !== undefined) {
      updateData.manualStatus = manualStatus;
      updateData.manualDecisionAt = new Date();
    }

    if (manualNotes !== undefined) {
      updateData.manualNotes = manualNotes;
    }

    await prisma.jobAnalysis.update({
      where: { id },
      data: updateData,
    });

    revalidatePath(`/vaga/${id}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error updating job details:', error);
    return { success: false, error: 'Failed to update job details' };
  }
}
