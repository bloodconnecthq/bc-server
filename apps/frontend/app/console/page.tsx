'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function ConsolePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  console.log("ConsolePage - user:", user, "isLoading:", isLoading);

  useEffect(() => {
    if (!isLoading && user) {
      switch (user.role) {
        case 'donneur':
          router.push('/donor/');
          break;
        case 'infirmier':
          router.push('/hospital');
          break;
        case 'medecin':
          router.push('/hospital');
          break;
        case 'admin_hopital':
          router.push('/hospital');
          break;
        case 'super_admin':
          router.push('/console/donors');
          break;
        default:
          router.push('/auth/signin');
      }
    }
  }, [user, isLoading, router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground-500">Redirection en cours...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}