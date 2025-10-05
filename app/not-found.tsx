import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 px-4 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-3">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl">Página não encontrada</CardTitle>
          <CardDescription className="text-lg">
            A página que você está procurando não existe ou foi removida.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p className="text-6xl font-bold mb-4">404</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
