import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Home, Search } from 'lucide-react';

export default function JobNotFound() {
  return (
    <div className="container mx-auto py-16 px-4 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-3">
              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl">Vaga não encontrada</CardTitle>
          <CardDescription className="text-lg">
            A vaga que você está procurando não existe, foi removida ou o ID fornecido é inválido.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-muted/50 rounded-lg p-6 mb-4">
            <p className="text-6xl font-bold text-muted-foreground mb-2">404</p>
            <p className="text-sm text-muted-foreground">
              Verifique se o link está correto ou tente buscar a vaga no dashboard.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" size="lg">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Vagas
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
