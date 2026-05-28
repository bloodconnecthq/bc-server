'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { API_BASE_URL, API_ENDPOINTS, type User, type AuthResponse, type SignupData, type LoginData } from '@/config/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Méthodes
  inscription: (data: SignupData) => Promise<void>;
  connexion: (data: LoginData) => Promise<AuthResponse>;
  deconnexion: () => Promise<void>;
  verifierAuth: () => Promise<boolean>;
  chargerProfil: () => Promise<void>;

  // Vérifications
  peutAcceder: (roles: string[]) => boolean;
  estConnecte: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveAuthData = useCallback((authToken: string, userData: User | null) => {
    localStorage.setItem('auth_token', authToken)
    if (userData) {
      localStorage.setItem('auth_user', JSON.stringify(userData))
    }
    setToken(authToken)
    setUser(userData)
  }, [])

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }, [])

  const refreshProfile = useCallback(async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.compte.profil}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) return null

      const responseData = (await response.json()) as any
      const inner = responseData?.data
      // Unwrap BaseTransformer format: { $type: 'item', transformerData: [user, ...] }
      if (inner?.$type === 'item' && Array.isArray(inner.transformerData)) {
        return inner.transformerData[0] ?? null
      }
      return inner?.user ?? inner ?? null
    } catch (error) {
      console.error('Erreur chargement profil:', error)
      return null
    }
  }, [])

  // Charger le token et l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const tokenStorage = localStorage.getItem('auth_token')
    const userStorage = localStorage.getItem('auth_user')

    if (tokenStorage) {
      let storedUser = null
      try {
        storedUser = userStorage ? JSON.parse(userStorage) : null
      } catch (error) {
        console.warn('Impossible de lire auth_user depuis localStorage:', error)
        clearAuthData()
        setIsLoading(false)
        return
      }

      setToken(tokenStorage)
      if (storedUser) {
        setUser(storedUser)
      }
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [clearAuthData]);

  const extractAuthResponse = useCallback((authData: any) => {
    // Registration format: { donnees: { utilisateur, token } }
    // Login format: { user, token } or { data: { user, token } }
    const token =
      authData?.donnees?.token ??
      authData?.data?.token ??
      authData?.token

    const userData =
      authData?.donnees?.utilisateur ??
      authData?.data?.user ??
      authData?.user

    if (!token || !userData) {
      throw new Error('Réponse d\'authentification invalide')
    }

    return { token, userData }
  }, [])

  // Charger le profil
  const chargerProfil = useCallback(async () => {
    if (!token) return;

    const profileUser = await refreshProfile(token)
    if (profileUser) {
      saveAuthData(token, profileUser)
    }
  }, [refreshProfile, saveAuthData, token]);

  // Inscription — crée le compte uniquement, sans connecter l'utilisateur
  const inscription = useCallback(async (data: SignupData): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.inscription}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erreur || error.message || "Erreur lors de l'inscription");
    }
    // Compte créé — l'appelant redirige vers la page de connexion
  }, []);

  // Connexion — charge le profil avec le token frais (pas le token du state React)
  const connexion = useCallback(async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.connexion}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Identifiants invalides');
      }

      const authData = (await response.json()) as any;
      const { token: freshToken, userData } = extractAuthResponse(authData)

      // Charger le profil complet avec le token frais avant de sauvegarder
      // (évite le bug de closure sur le state `token` React qui serait encore l'ancien)
      const profileUser = await refreshProfile(freshToken)
      saveAuthData(freshToken, profileUser ?? userData)

      return authData;
    } catch (error) {
      throw error;
    }
  }, [extractAuthResponse, saveAuthData, refreshProfile]);

  // Déconnexion
  const deconnexion = useCallback(async () => {
    if (!token) {
      // Si pas de token, nettoyer directement
      clearAuthData()
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.deconnexion}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Erreur lors de la déconnexion serveur, nettoyage local quand même');
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      // Nettoyer les données locales en tous cas
      clearAuthData()
    }
  }, [clearAuthData, token]);

  // Vérifier l'authentification
  const verifierAuth = useCallback(async () => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.verifier}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur vérification auth:', error);
      return false;
    }
  }, [token]);

  // Vérifier si l'utilisateur peut accéder à certains rôles
  const peutAcceder = useCallback((roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  // Vérifier si l'utilisateur est connecté
  const estConnecte = useCallback(() => {
    return !!user && !!token;
  }, [user, token]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: estConnecte(),
    inscription,
    connexion,
    deconnexion,
    verifierAuth,
    chargerProfil,
    peutAcceder,
    estConnecte,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook pour utiliser le contexte d'authentification
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'AuthProvider');
  }
  return context;
}

/**
 * Hook pour vérifier si l'utilisateur a accès à certains rôles
 */
export function useAuthRole(...roles: string[]) {
  const { peutAcceder } = useAuth();
  return peutAcceder(roles);
}
