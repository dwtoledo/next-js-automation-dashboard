'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateJobStatus } from '@/app/actions';
import { FileText, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { TableRowActionsProps } from '@/lib/types';

export default function TableRowActions({
    jobId,
    manualStatus,
}: TableRowActionsProps) {
    const [isIgnoring, setIsIgnoring] = useState(false);
    const isIgnored = manualStatus === 'IGNORED';

    const handleIgnore = async () => {
        setIsIgnoring(true);
        try {
            const result = await updateJobStatus(jobId, 'IGNORED');
            if (!result.success) {
                toast.error('Erro ao ignorar vaga', {
                    description: 'Não foi possível ignorar a vaga. Tente novamente.',
                });
            } else {
                toast.success('Vaga ignorada com sucesso', {
                    description: 'A vaga foi marcada como ignorada.',
                });
            }
        } catch (error) {
            console.error('Error ignoring job:', error);
            toast.error('Erro ao ignorar vaga', {
                description: 'Ocorreu um erro inesperado. Tente novamente.',
            });
        } finally {
            setIsIgnoring(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="xs"
                title="Ver Detalhes"
                onClick={() => {
                    // TODO: Implement details modal/page
                }}
            >
                <FileText className="size-4" />
                Ver Detalhes
            </Button>
            <Button
                variant={isIgnored ? "outline" : "destructive"}
                size="xs"
                onClick={handleIgnore}
                disabled={isIgnoring || isIgnored}
                title={isIgnored ? "Vaga já foi ignorada" : "Ignorar esta vaga"}
            >
                {isIgnored ? (
                    <>
                        <Check className="size-4" />
                        Ignorado
                    </>
                ) : (
                    <>
                        <X className="size-4" />
                        {isIgnoring ? 'Ignorando...' : 'Ignorar'}
                    </>
                )}
            </Button>
        </div>
    );
}
