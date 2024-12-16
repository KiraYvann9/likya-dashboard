'use client'

import { Switch } from "@/components/ui/switch"
import {cn} from "@/lib/utils";
import {changeStatus} from "@/services/service";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-hot-toast";
import Spinner from "@/components/spinner";

export const SwitchComponent =({id, status}:{status: boolean, id: string}) =>{

    const queryClient = useQueryClient()

    const activeUserToggle = async({action}:{action: string}) =>{
        const response = await changeStatus(`/users/${id}/activate?action=${action}`)
        return response.data
    }

    const changeStatusMutation = useMutation({
        mutationFn: activeUserToggle,
        onSuccess: ()=>{
            console.log('Delete Success')
            toast.success('Status mise à jour avec succès !')
            queryClient.invalidateQueries({queryKey: ['users']})
        },
        onError: ()=>{
            toast.error('Oups! Quelque chose s\'est mal passé')
        }
    })

    const onStatusChange = (action: string) =>{
        changeStatusMutation.mutate({action})
    }
    return(
        <>
            { changeStatusMutation.isPending? <Spinner />:
                <Switch id="airplane-mode"
                        checked={status}
                        onCheckedChange={(value)=>{
                            const action = value ? 'activate':'deactivate'
                            onStatusChange(action)
                        }}
                        className={cn('data-[state=unchecked]:bg-yellow-400', status && 'data-[state=checked]:bg-green-500')}
                />
            }
        </>
    )
}