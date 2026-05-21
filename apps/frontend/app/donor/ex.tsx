'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@heroui/react';
import { Call, Sms, Calendar, Location, Logout } from 'iconsax-reactjs';

export default function DonorDashboard() {
    const { user, isLoading, deconnexion } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user && user.role !== 'donneur') {
            router.push('/console');
        }
    }, [user, isLoading, router]);

    const handleLogout = async () => {
        await deconnexion();
        router.push('/auth/signin');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['donneur']}>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                    
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Bienvenue, {user?.nomComplet || user?.email}
                            </h1>
                            <p className="text-gray-500 mt-2">Tableau de bord donneur</p>
                        </div>
                        <Button
                            variant="danger"
                            onClick={handleLogout}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            <Logout size={18} />
                            Déconnexion
                        </Button>
                    </div>

                    
                    <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Mon Profil</h2>

                        <div className="grid grid-cols-2 gap-8">
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Nom complet</label>
                                    <p className="text-lg font-medium text-gray-900">{user?.nomComplet || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Sms size={14} />
                                        Adresse email
                                    </label>
                                    <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Call size={14} />
                                        Téléphone
                                    </label>
                                    <p className="text-lg font-medium text-gray-900">{user?.telephone || 'N/A'}</p>
                                </div>
                            </div>

                            
                            <div className="space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Calendar size={14} />
                                        Date de naissance
                                    </label>
                                    <p className="text-lg font-medium text-gray-900">
                                        {user?.dateNaissance
                                            ? new Date(user.dateNaissance).toLocaleDateString('fr-FR')
                                            : 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Location size={14} />
                                        Commune
                                    </label>
                                    <p className="text-lg font-medium text-gray-900">{user?.commune || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Statut du compte</label>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${user?.estActif ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <p className="text-lg font-medium text-gray-900">
                                            {user?.estActif ? 'Actif' : 'Inactif'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="mt-8 pt-8 border-t border-gray-200 flex gap-4">
                            <Button
                                className="flex-1 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl font-medium"
                            >
                                Prendre un rendez-vous
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium"
                            >
                                Historique des dons
                            </Button>
                        </div>
                    </div>

                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-red-600">0</p>
                            <p className="text-gray-500 text-sm mt-2">Dons effectués</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-red-600">0</p>
                            <p className="text-gray-500 text-sm mt-2">Vies sauvées</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-red-600">0</p>
                            <p className="text-gray-500 text-sm mt-2">Points de fidelité</p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}