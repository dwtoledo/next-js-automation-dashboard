'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { ComponentProps } from 'react';

interface BackButtonProps {
  children?: React.ReactNode;
  variant?: ComponentProps<typeof Button>['variant'];
  size?: ComponentProps<typeof Button>['size'];
}

export function BackButton({ 
  children = '← Voltar', 
  variant = 'outline', 
  size = 'sm' 
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}
