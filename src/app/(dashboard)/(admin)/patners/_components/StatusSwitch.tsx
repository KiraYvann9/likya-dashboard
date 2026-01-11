'use client'

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Spinner from "@/components/spinner";
import api from "@/services/axiosConfig";

export const StatusSwitch = ({ id, status }: { status: boolean, id: string }) => {

    const queryClient = useQueryClient()

    const activeUserToggle = async () => {
        const response = await api.patch(`/admin/establishements/${id}/active-account`)
        return response.data
    }

    const changeStatusMutation = useMutation({
        mutationFn: activeUserToggle,
        onSuccess: () => {
            toast.success('Status mise à jour avec succès !')
            queryClient.invalidateQueries({queryKey: ['partners']})
         },
        onError: () => {
            toast.error('Oups! Quelque chose s\'est mal passé')
        }
    })

    const onStatusChange = () => {
        changeStatusMutation.mutate()
    }

    return (
        <>
            {changeStatusMutation.isPending ? <Spinner /> :
                <Switch id="airplane-mode"
                        checked={status}
                        onCheckedChange={onStatusChange}
                        className={cn('data-[state=unchecked]:bg-yellow-400', status && 'data-[state=checked]:bg-green-500')}
                />
            }
        </>
    )

}