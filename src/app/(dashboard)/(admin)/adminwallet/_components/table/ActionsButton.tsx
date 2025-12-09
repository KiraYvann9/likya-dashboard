"use client"

import * as React from "react"
import { MoreHorizontal, User, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Ban, Shield, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserModal } from "@/stores/useModalStore"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/services/axiosConfig"
import toast from "react-hot-toast"
import Spinner from "@/components/spinner"

export default function ActionsButton({ row }: { row: any }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DisplayModal id={row.original.user_id} walletId={row.original._id || row.original.id} walletRef={row.original.wallet_ref}/>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const DisplayModal = ({ id, walletId, walletRef }: { id: string; walletId: string, walletRef: string }) => {
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = React.useState(false)

    const getWalletDetails = async () => {
        const response = await api.get(`/profiles/${id}`)
        return response.data
    }

    const {data: wallet_owner, isLoading, error} = useQuery({
        queryKey: ['wallet_owner', id],
        queryFn: getWalletDetails,
        enabled: !!id
    })

    const activateWallet = useMutation({
        mutationFn: async () => {
            const response = await api.patch(`/wallets/${walletId}/activate`)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
            toast.success('Wallet activé avec succès')
            setIsOpen(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'activation du wallet')
        }
    })

    const blockWallet = useMutation({
        mutationFn: async () => {
            const response = await api.patch(`/wallets/${walletId}/block`)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
            toast.success('Wallet bloqué avec succès')
            setIsOpen(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Erreur lors du blocage du wallet')
        }
    })

    const closeWallet = useMutation({
        mutationFn: async () => {
            const response = await api.patch(`/wallets/${walletId}/close`)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
            toast.success('Wallet fermé avec succès')
            setIsOpen(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Erreur lors de la fermeture du wallet')
        }
    })

    console.log('Selected Wallet', wallet_owner)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <User className="mr-2 h-4 w-4" />
                    Voir les détails
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
                {/* Header avec gradient */}
                <div className="bg-gradient-to-r from-[#1C8973] to-[#59AD96] px-6 py-8 text-white">
                    <DialogTitle className="text-2xl font-bold mb-2">
                        Détails du Wallet - Ref. {walletRef}
                    </DialogTitle>
                    <DialogDescription className="text-blue-100">
                        Informations complètes et actions disponibles
                    </DialogDescription>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Spinner />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-8 px-6">
                        <XCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">Erreur lors du chargement des données</p>
                    </div>
                ) : wallet_owner ? (
                    <>
                        {/* Informations du propriétaire */}
                        <div className="px-6 py-6 space-y-6">
                            {/* Carte d'identité */}
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-5 border border-slate-200">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-600 rounded-full p-3">
                                        <User className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-slate-900 mb-1">
                                            {wallet_owner.firstname && wallet_owner.lastname 
                                                ? `${wallet_owner.firstname} ${wallet_owner.lastname}`
                                                : 'Non renseigné'}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                {wallet_owner.matricule || 'N/A'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Informations de contact */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-blue-100 rounded-full p-2">
                                            <Mail className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900 truncate">
                                        {wallet_owner.email || 'Non renseigné'}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-green-100 rounded-full p-2">
                                            <Phone className="h-4 w-4 text-green-600" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {wallet_owner.contact || 'Non renseigné'}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-purple-100 rounded-full p-2">
                                            <MapPin className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Adresse</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {wallet_owner.address || 'Non renseigné'}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-orange-100 rounded-full p-2">
                                            <Calendar className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Naissance</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {wallet_owner.date_of_birth 
                                            ? new Date(wallet_owner.date_of_birth).toLocaleDateString('fr-FR')
                                            : 'Non renseigné'}
                                    </p>
                                </div>
                            </div>

                            {/* Date de création */}
                            <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span>
                                    Créé le {wallet_owner.created_at 
                                        ? new Date(wallet_owner.created_at).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                        : 'Non disponible'}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        {/* Actions sur le wallet */}
                        <div className="px-6 py-6 bg-slate-50">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="h-5 w-5 text-slate-600" />
                                <h4 className="font-semibold text-slate-900">Actions sur le wallet</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Button
                                    onClick={() => activateWallet.mutate()}
                                    disabled={activateWallet.isPending}
                                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-200 h-auto py-4"
                                >
                                    {activateWallet.isPending ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Spinner />
                                            <span className="text-sm">Activation...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="font-semibold">Activer</span>
                                        </div>
                                    )}
                                </Button>

                                <Button
                                    onClick={() => blockWallet.mutate()}
                                    disabled={blockWallet.isPending}
                                    className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 transition-all duration-200 h-auto py-4"
                                >
                                    {blockWallet.isPending ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Spinner />
                                            <span className="text-sm">Blocage...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Ban className="h-5 w-5" />
                                            <span className="font-semibold">Bloquer</span>
                                        </div>
                                    )}
                                </Button>

                                <Button
                                    onClick={() => closeWallet.mutate()}
                                    disabled={closeWallet.isPending}
                                    className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 transition-all duration-200 h-auto py-4"
                                >
                                    {closeWallet.isPending ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Spinner />
                                            <span className="text-sm">Fermeture...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <XCircle className="h-5 w-5" />
                                            <span className="font-semibold">Fermer</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 px-6 text-muted-foreground">
                        <User className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">Aucune information disponible</p>
                    </div>
                )}

                <DialogFooter className="px-6 py-4 bg-slate-50 border-t">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                            Fermer
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}