"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Drop } from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";

// Role → space mapping for smart redirects after wrong-role access
const ROLE_HOME: Record<string, string> = {
  donneur:      "/donor",
  super_admin:  "/console",
  medecin:      "/hospital",
  infirmier:    "/hospital",
  admin_hopital:"/hospital",
};

interface AuthGuardProps {
  /** Roles allowed to access this space */
  allowedRoles: string[];
  children: React.ReactNode;
  /** Where to send unauthenticated users (default: /auth/signin) */
  loginPath?: string;
}

export function AuthGuard({
  allowedRoles,
  children,
  loginPath = "/auth/signin",
}: AuthGuardProps) {
  const { user, token, isLoading, peutAcceder } = useAuth();
  const router  = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    // Wait until auth context has read localStorage
    if (isLoading) return;
    if (handled.current) return;

    if (!token || !user) {
      // Not logged in → go to sign-in, remember where they wanted to go
      handled.current = true;
      const callbackUrl = window.location.pathname;
      router.replace(`${loginPath}?redirect=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (!peutAcceder(allowedRoles)) {
      // Logged in but wrong role → redirect to their own space
      handled.current = true;
      const home = ROLE_HOME[user.role] ?? loginPath;
      router.replace(home);
    }
  }, [isLoading, token, user, peutAcceder, allowedRoles, router, loginPath]);

  // Loading: auth not yet resolved from localStorage
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // Not authenticated or wrong role — guard will redirect, show blank screen meanwhile
  if (!token || !user || !peutAcceder(allowedRoles)) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-200">
          <Drop size={24} color="white" variant="Bold" />
        </div>
        <div className="space-y-1">
          <div className="w-6 h-6 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-400 font-medium">Vérification de l'accès…</p>
        </div>
      </div>
    </div>
  );
}
