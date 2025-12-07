
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

    // rolesData / rolesLoading already provided above

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-[640px] w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-xl p-6 my-0">
                <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
                    <DialogTitle>
                        {status === 'CREATE' && 'Création'}
                        {status === 'DETAIL' && 'Détails'}
                        {status === 'EDIT' && 'Modification'}
                    </DialogTitle>
                    <DialogDescription>
                        {status === 'CREATE' && 'Création d\'un utilisateur'}
                        {status === 'DETAIL' && 'Détail de l\'utilisateur.'}
                        {status === 'EDIT' && 'Modification de l\'utilisateur'}
                    </DialogDescription>
                </DialogHeader>

                <div className="">
                    {status === 'CREATE' && <CreateUserForm />}
                    {status === 'EDIT' && <EditUserForm />}
                </div>

                {status === 'DETAIL' &&
                    <>
                        <div className={'my-6 space-y-4'}>
                            <div className={'flex flex-col gap-1'}>
                                <span className={'text-muted-foreground'}>Nom</span>
                                <h3 className={'text-xl font-semibold'}>{modalData.lastname} {modalData?.firstname} </h3>
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <span className={'text-muted-foreground'}>N° Téléphone</span>
                                {modalData?.phonenumber ?
                                    <h3 className={'text-xl font-semibold'}>{modalData?.phonenumber}</h3>
                                    :
                                    <span className="text-gray-500 italic">Aucun numéro de téléphone ajouté</span>
                                }
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <span className={'text-muted-foreground'}>E-mail</span>
                                <h3 className={'text-xl font-semibold'}>{modalData?.email}</h3>
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <span className={'text-muted-foreground'}>Rôle</span>
                                <div className="inline-flex items-center gap-3">
                                    {userLoading ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            <Select onValueChange={(val) => setSelectedRole(val)} defaultValue={selectedRole || undefined}>
                                                <SelectTrigger className={'w-64 h-10 border-2 border-gray-200 rounded-md px-3'}>
                                                    <SelectValue placeholder={resolvedRoleLabel} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(rolesData || []).map((r: any) => (
                                                        <SelectItem value={r._id} key={r._id}>{r.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                onClick={() => selectedRole && assignRoleMutation.mutate(selectedRole)}
                                                className={'bg-custom_color-green text-white px-3 py-2'}
                                                disabled={!selectedRole || assignRoleMutation.isPending}
                                            >
                                                {assignRoleMutation.isPending ? 'En cours...' : 'Modifier le rôle'}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <span className={'text-muted-foreground'}>Adresse</span>
                                {modalData?.attributes?.address ?
                                    <h3 className={'text-xl font-semibold'}>{modalData?.attributes?.address}</h3>
                                    :
                                    <span className="text-gray-500 italic">Aucun address ajouté</span>
                                }
                            </div>

                        </div>
                        <DialogFooter className={'flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800'}>
                            <DialogClose asChild>
                                <Button variant={'ghost'} className="px-4">Fermer</Button>
                            </DialogClose>
                            <Button onClick={() => openModal('EDIT', modalData)} className={'bg-custom_color-green text-white hover:brightness-95 px-4'}>Modifier</Button>
                        </DialogFooter>
                    </>
                }
            </DialogContent>
        </Dialog>
    )
}
