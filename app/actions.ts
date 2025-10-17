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

export async function updateJobDetails({
  id,
  manualStatus,
  manualNotes
}: UpdateJobDetailsParams) {
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
      const sanitized = manualNotes
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();

      if (sanitized.length > 2000) {
        return {
          success: false,
          error: 'Anotações excedem 2000 caracteres'
        };
      }

      updateData.manualNotes = sanitized;
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
    return {
      success: false,
      error: 'Falha ao atualizar detalhes da vaga'
    };
  }
}

export async function updateMultipleJobStatuses({
  jobIds,
  newStatus,
  newNotes,
}: {
  jobIds: string[];
  newStatus: ManualStatus;
  newNotes: string;
}) {
  if (!jobIds || jobIds.length === 0) {
    return { success: false, error: 'Nenhuma vaga selecionada' };
  }

  try {
    const sanitizedNotes = newNotes
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim();

    if (sanitizedNotes.length > 2000) {
      return {
        success: false,
        error: 'Anotações excedem 2000 caracteres',
      };
    }

    await prisma.jobAnalysis.updateMany({
      where: {
        id: {
          in: jobIds,
        },
      },
      data: {
        manualStatus: newStatus,
        manualNotes: sanitizedNotes,
        manualDecisionAt: new Date(),
      },
    });

    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error updating multiple job statuses:', error);
    return { success: false, error: 'Falha ao atualizar vagas' };
  }
}
