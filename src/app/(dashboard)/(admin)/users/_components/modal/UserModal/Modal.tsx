import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CreateUserForm } from "../../form/create/CreateUserForm";
import { useUserModal } from "@/stores/useModalStore";
import { EditUserForm } from "../../form/edit/EditUserForm";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { getUserInfo } from "@/services/service";
import api from '@/services/axiosConfig'
import Spinner from "@/components/spinner";
import { User, Phone, Mail, Shield, MapPin, Edit3, UserPlus, Eye } from "lucide-react";

interface Role {
    _id: string;
    name: string;
}

export function UserModal() {
    const { isOpen, openModal, closeModal, modalData, status } = useUserModal()

    const { data: userQueryData, isFetching: userLoading } = useQuery({
        queryKey: ['user', modalData?.user_id || modalData?._id],
        queryFn: async () => await getUserInfo((modalData?.user_id || modalData?._id) as string),
        enabled: !!(modalData?.user_id || modalData?._id) && status === 'DETAIL',
        staleTime: 1000 * 60 * 5,
    })

    const resolvedRoleLabel = ((userQueryData as any)?.data?.roles ? (userQueryData as any).data.roles.map((r: any) => r.name).join(', ') : null) || (userQueryData as any)?.data?.role?.name || modalData?.role || '—'

    const queryClient = useQueryClient()
    const { data: rolesData, isLoading: rolesLoading } = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const res = await api.get('/roles')
            return res.data?.items || []
        },
        enabled: status === 'DETAIL'
    })

    const [selectedRole, setSelectedRole] = useState<string | null>(null)

    useEffect(() => {
        let roleId: string | null = null
        const userRoles = (userQueryData as any)?.data?.roles
        if (userRoles && userRoles.length > 0) {
            roleId = userRoles[0]._id || null
            if (!roleId && rolesData && rolesData.length > 0) {
                const match = rolesData.find((r: any) => r.name === userRoles[0].name)
                roleId = match?._id || null
            }
        }

        if (!roleId && modalData?.role?._id) {
            roleId = modalData.role._id
        }

        setSelectedRole(roleId)
    }, [userQueryData, modalData, rolesData])

    const assignRole = async (roleId: string) => {
        const userId = (modalData?.user_id || modalData?._id) as string
        return await api.put(`/users/${userId}/assign-roles`, { roles: [roleId] })
    }

    const assignRoleMutation = useMutation({
        mutationKey: ['assign-role', modalData?.user_id || modalData?._id, selectedRole],
        mutationFn: async (roleId: string) => await assignRole(roleId),
        onSuccess: (res) => {
            toast.success('Rôle attribué avec succès')
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['user', modalData?.user_id || modalData?._id] })
        },
        onError: (err: any) => {
            console.error('Assign role error', err)
            toast.error(err?.message || 'Erreur lors de l\'attribution du rôle')
        }
    })

    const getHeaderIcon = () => {
        if (status === 'CREATE') return <UserPlus className="h-5 w-5 text-white" />
        if (status === 'EDIT') return <Edit3 className="h-5 w-5 text-white"/>
        return <Eye className="h-5 w-5 text-white" />
    }

    const getHeaderColor = () => {
        if (status === 'CREATE') return 'from-[#1C8973] to-[#59AD96]'
        if (status === 'EDIT') return 'from-blue-600 to-indigo-700'
        return 'from-[#1C8973] to-[#59AD96]'
    }

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-[680px] w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-0 overflow-hidden border-0">
                {/* Header avec gradient */}
                <div className={`bg-gradient-to-r ${getHeaderColor()} px-6 py-6`}>
                    <DialogHeader className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                {getHeaderIcon()}
                            </div>
                            <div className="text-white">
                                <DialogTitle className="text-2xl font-bold">
                                    {status === 'CREATE' && 'Nouvel utilisateur'}
                                    {status === 'DETAIL' && 'Profil utilisateur'}
                                    {status === 'EDIT' && 'Modifier l\'utilisateur'}
                                </DialogTitle>
                                <DialogDescription className="text-white/90 text-sm mt-1">
                                    {status === 'CREATE' && 'Ajoutez un nouvel utilisateur au système'}
                                    {status === 'DETAIL' && 'Consultez et gérez les informations'}
                                    {status === 'EDIT' && 'Mettez à jour les informations'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Contenu principal */}
                <div className="px-6 py-6">
                    {status === 'CREATE' && <CreateUserForm />}
                    {status === 'EDIT' && <EditUserForm />}

                    {status === 'DETAIL' && (
                        <div className="space-y-5">
                            {/* Nom complet */}
                            <div className="group">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Nom complet
                                    </span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white ml-12 -mt-1">
                                    {modalData.lastname} {modalData?.firstname}
                                </p>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                            {/* Téléphone */}
                            <div className="group">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                                        <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Numéro de téléphone
                                    </span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white ml-12 -mt-1">
                                    {modalData?.phonenumber || (
                                        <span className="text-gray-400 dark:text-gray-500 italic font-normal text-base">
                                            Aucun numéro ajouté
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                            {/* Email */}
                            <div className="group">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                                        <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Adresse e-mail
                                    </span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white ml-12 -mt-1 break-all">
                                    {modalData?.email}
                                </p>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                            {/* Rôle avec sélecteur */}
                            <div className="group">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                                        <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Rôle
                                    </span>
                                </div>
                                <div className="ml-12 -mt-1 flex items-center gap-3 flex-wrap">
                                    {userLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Spinner />
                                            <span className="text-sm text-gray-500">Chargement...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Select 
                                                onValueChange={(val) => setSelectedRole(val)} 
                                                defaultValue={selectedRole || undefined}
                                            >
                                                <SelectTrigger className="w-64 h-11 border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                                                    <SelectValue placeholder={resolvedRoleLabel} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(rolesData || []).map((r: any) => (
                                                        <SelectItem value={r._id} key={r._id}>
                                                            {r.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                onClick={() => selectedRole && assignRoleMutation.mutate(selectedRole)}
                                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 h-11 rounded-lg shadow-sm hover:shadow-md transition-all"
                                                disabled={!selectedRole || assignRoleMutation.isPending}
                                            >
                                                <Shield className="h-4 w-4 mr-2" />
                                                {assignRoleMutation.isPending ? 'En cours...' : 'Modifier'}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                            {/* Adresse */}
                            <div className="group">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg group-hover:bg-pink-100 dark:group-hover:bg-pink-900/30 transition-colors">
                                        <MapPin className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Adresse
                                    </span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white ml-12 -mt-1">
                                    {modalData?.attributes?.address || (
                                        <span className="text-gray-400 dark:text-gray-500 italic font-normal text-base">
                                            Aucune adresse ajoutée
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {status === 'DETAIL' && (
                    <DialogFooter className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                        <DialogClose asChild>
                            <Button 
                                variant="outline" 
                                className="px-5 h-10 rounded-lg border-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Fermer
                            </Button>
                        </DialogClose>
                        <Button 
                            onClick={() => openModal('EDIT', modalData)} 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 h-10 rounded-lg shadow-sm hover:shadow-md transition-all"
                            disabled
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Modifier
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}