interface JobDescriptionTabProps {
  jobDescription: string | null;
}

export function JobDescriptionTab({ jobDescription }: JobDescriptionTabProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">Descrição da Vaga</h3>
      {jobDescription ? (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {jobDescription}
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground italic">
          Descrição da vaga não disponível.
        </p>
      )}
    </div>
  );
}
