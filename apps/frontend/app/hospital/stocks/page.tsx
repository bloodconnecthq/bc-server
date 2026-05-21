'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { useHospitalDashboard } from "@/lib/hooks/useHospitalDashboard";
import { StockCard } from "@/components/hospital/stock-card";
import { Button } from '@heroui/react';
import { ArrowDown, ArrowUp, Warning2 } from 'iconsax-reactjs';

export default function HospitalStocksPage() {
    const { stocks, isLoading: loading, stocksError } = useHospitalDashboard();

    // Convertir les stocks API en format StockCard
    const stockCards = stocks?.map(stock => ({
        group: stock.groupeSanguin || 'Inconnu',
        level: Math.min((stock.quantite / 50) * 100, 100), // Calculer le niveau basé sur une capacité max de 50
        units: stock.quantite,
        status: stock.quantite < 5 ? "critical" as const : stock.quantite < 15 ? "low" as const : "ok" as const,
    })) || [];

    // Statistiques des stocks
    const totalUnits = stocks?.reduce((sum, stock) => sum + stock.quantite, 0) || 0;
    const criticalStocks = stocks?.filter(stock => stock.quantite < 5).length || 0;
    const lowStocks = stocks?.filter(stock => stock.quantite >= 5 && stock.quantite < 15).length || 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Chargement des stocks...</p>
                </div>
            </div>
        );
    }

    if (stocksError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Erreur lors du chargement des stocks</p>
                    <p className="text-sm text-gray-500 mt-2">{stocksError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des stocks</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        CHU de Cotonou — Mise à jour en temps réel
                    </p>
                </div>
                <Button className="bg-red-600 text-white hover:bg-red-700">
                    + Enregistrer un don
                </Button>
            </div>

            {/* Statistiques générales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total poches</p>
                            <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <ArrowUp size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Stocks critiques</p>
                            <p className="text-2xl font-bold text-red-600">{criticalStocks}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                            <Warning2 size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Stocks faibles</p>
                            <p className="text-2xl font-bold text-amber-600">{lowStocks}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                            <ArrowDown size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grille des stocks par groupe sanguin */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Stocks par groupe sanguin
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stockCards.map((stock) => (
                        <StockCard key={stock.group} {...stock} />
                    ))}
                </div>
            </div>

            {/* Alertes pour stocks critiques */}
            {criticalStocks > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Warning2 size={24} className="text-red-600 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-red-900 mb-2">
                                Alertes de stock critique
                            </h3>
                            <p className="text-red-700 mb-4">
                                {criticalStocks} groupe(s) sanguin(s) ont un stock critique (moins de 5 poches).
                                Veuillez contacter le CNTS pour réapprovisionnement.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {stocks?.filter(stock => stock.quantite < 5).map(stock => (
                                    <span key={stock.groupeSanguin} className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                        {stock.groupeSanguin}: {stock.quantite} poches
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}