"use client"

import * as React from "react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserModal } from "@/stores/useModalStore";


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
import { Separator } from "@radix-ui/react-dropdown-menu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/services/axiosConfig"
import toast from "react-hot-toast"
import Spinner from "@/components/spinner"



export default function ActionsButton({ row }: { row: any }) {

    const openModal = useUserModal.getState().openModal

    const getUserDetails = async (id: string) => {
        const response = await api.get(`/profiles/${id}`);
        return response.data;
    }

    const sendCredentials = async () => {
        const response = await api.post(`/admin/establishements/${row.original._id}/send-account-credentials`)
        return response.data;
    }

    const mutation = useMutation({
        mutationFn: sendCredentials,
        onSuccess: async (data) => {
            toast.success("Invitation envoyée avec success!")
        }
    })

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
                <DropdownMenuItem onClick={() => mutation.mutate()}>Inviter</DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal('EDIT', row.original)}>Modifier</DropdownMenuItem>

                <Separator />
                
                <DeleteUserDialog id={row.original.id} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const DeleteUserDialog = ({ id }: { id: string }) => {

    const queryClient = useQueryClient();

    const deleteUserMutation = useMutation({
        mutationFn: async (userID: string) => {
            await api.delete(`/users/${userID}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('Utilisateur supprimé avec succès')
        }
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild disabled={deleteUserMutation.isPending}>
                {deleteUserMutation.isPending ? <Spinner /> :
                    <Button variant="ghost" className="text-red-500" >Supprimer</Button>
                }
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteUserMutation.mutate(id)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}