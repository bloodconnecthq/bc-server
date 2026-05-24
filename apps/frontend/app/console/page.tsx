'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function getDashboardByRole(role: string | undefined | null): string {
  if (role === 'donneur') return '/donor';
  if (role === 'infirmier' || role === 'medecin' || role === 'admin_hopital') return '/hospital';
  if (role === 'super_admin') return '/console/donors';
  return '/auth/signin';
}

export default function ConsolePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/auth/signin');
      return;
    }
    const dest = getDashboardByRole(user.role);
    // Avoid infinite loop: only redirect if not already on console/donors
    if (dest !== '/console' && dest !== window.location.pathname) {
      router.replace(dest);
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-gray-500">Redirection en cours...</p>
      </div>
    </div>
  );
}
