'use client'

import './nav.css'
import {useUserStore} from "@/stores/useUserStore";

import {LogOut} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";

export const NavComponent = () =>{
    const {user, logOut} = useUserStore()
    console.log('Connexted user: ', user)
    const router = useRouter()

    const mutation = useMutation({
        mutationFn: logOut,
        onSuccess: ()=>{
            router.push('/')
            toast.success('Vous êtes déconnecté')
        }
    })

    return(
        <nav className={'nav'}>
            <div>
                {user?.user.fullname}
                <Button onClick={() =>mutation.mutate()} variant={'secondary'} >
                    <LogOut/>
                </Button>
            </div>
        </nav>
    )
}