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
import { useCategoryModal } from "@/stores/useModalStore";
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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/services/axiosConfig"
import toast from "react-hot-toast"
import Spinner from "@/components/spinner"

export default function CategoryActionsButton({ row }: { row: any }) {
    const openModal = useCategoryModal.getState().openModal

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
                <DropdownMenuItem onClick={() => openModal('DETAIL', row.original)}>Détail</DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal('EDIT', row.original)}>Modifier</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteCategoryDialog id={row.original?._id} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const DeleteCategoryDialog = ({ id }: { id: string }) => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (catId: string) => {
            await api.delete(`/categories/${catId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast.success('Catégorie supprimée avec succès')
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erreur lors de la suppression')
        }
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild disabled={deleteMutation.isPending}>
                <Button variant="ghost" className="text-red-500 w-full justify-start px-2 py-1.5 h-auto font-normal" >
                    {deleteMutation.isPending ? <Spinner /> : "Supprimer"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. La catégorie sera définitivement supprimée.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction className={'bg-red-400'} onClick={() => deleteMutation.mutate(id)}>Continuer</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
