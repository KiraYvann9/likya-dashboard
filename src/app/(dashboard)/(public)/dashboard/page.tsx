'use client';

import { CardComponent } from '@/components/CardComponent';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Users, 
    Wallet, 
    TrendingUp, 
    Activity, 
    ArrowUpRight, 
    ArrowDownRight,
    Search
} from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import api from "@/services/axiosConfig";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
    // Tentative de récupération de quelques stats (basée sur ce que j'ai vu dans le projet)
    const { data: walletData, isLoading: isLoadingWallets } = useQuery({
        queryKey: ['all-wallet'],
        queryFn: async () => {
            const response = await api.get(`/admin/wallets`, { params: { size: 1 } });
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['all-users-stats'],
        queryFn: async () => {
            const response = await api.get(`/users`, { params: { size: 1 } });
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const stats = [
        {
            title: "Utilisateurs Totaux",
            value: usersData?.total || "0",
            icon: Users,
            description: "+12% depuis le mois dernier",
            trend: "up",
            loading: isLoadingUsers
        },
        {
            title: "Wallets Actifs",
            value: walletData?.total || "0",
            icon: Wallet,
            description: "+5% depuis le mois dernier",
            trend: "up",
            loading: isLoadingWallets
        },
        {
            title: "Volume Transactions",
            value: "1,284,500 €",
            icon: TrendingUp,
            description: "+18% depuis le mois dernier",
            trend: "up",
            loading: false
        },
        {
            title: "Taux de Conversion",
            value: "3.2%",
            icon: Activity,
            description: "-2% depuis hier",
            trend: "down",
            loading: false
        }
    ];

    return (
        <CardComponent className={'w-full min-h-[70vh] p-6 space-y-8'}>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
                <p className="text-muted-foreground">
                    Bienvenue sur votre vue d'ensemble Likya.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {stat.loading ? (
                                <Skeleton className="h-8 w-[100px]" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        {stat.trend === 'up' ? (
                                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <ArrowDownRight className="h-3 w-3 text-red-500" />
                                        )}
                                        <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                                            {stat.description.split(' ')[0]}
                                        </span>
                                        {stat.description.split(' ').slice(1).join(' ')}
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Activité Récente (Placeholder large) */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Activité Récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Activity className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Nouvelle transaction de Wallet #{1000 + i}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Il y a {i * 10} minutes
                                        </p>
                                    </div>
                                    <div className="font-medium text-green-600">
                                        +{(Math.random() * 1000).toFixed(2)} €
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Info (Placeholder étroit) */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Actions Rapides</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <div className="rounded-md border p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <div className="text-sm font-medium">Rechercher un utilisateur</div>
                        </div>
                        <div className="rounded-md border p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors">
                            <Wallet className="h-5 w-5 text-muted-foreground" />
                            <div className="text-sm font-medium">Vérifier les soldes admin</div>
                        </div>
                        <div className="rounded-md border p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div className="text-sm font-medium">Gérer les partenaires</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </CardComponent>
    );
}