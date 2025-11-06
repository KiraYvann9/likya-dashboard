'use client'

import './nav.css'
import {useUserStore} from "@/stores/useUserStore";


import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";


import {
    LogOutIcon,
    Settings,
    User,
    ChevronDown,
    Bell,
    LogOut
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {ProfileComponent} from "@/components";
import {useProfileSheet} from "@/stores/useProfileSheet";
import { logout } from '../../services/auth_actions';
import { Separator } from '../ui/separator';

export const NavComponent = () =>{
    const openModal = useProfileSheet(s => s.openModal)
    const {user} = useUserStore()
    const router = useRouter()

    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: ()=>{
            router.push('/')
            toast.success('Vous êtes déconnecté')
        }
    })

    return(
        <nav className={'nav'}>
            <div className={'w-full flex items-center justify-between '}>
                <span className='text-3xl font-semibold'>
                    {user && user?.userinfo?.firstname || 'Utilisateur'}
                </span>

                <div className='flex gap-2 bg-white rounded-2xl overflow-hidden bg-gradient-to-br from-white to-white/5 border border-white shadow-sm'>
                    <Button variant={'ghost'} className='h-12 w-12'>
                        <Bell size={36} className={'text-muted-foreground'}/>
                    </Button>
                    <Button variant={'ghost'} className='h-12 w-12'>
                        <Settings size={22} className={'text-muted-foreground'}/>
                    </Button>
                    <Separator orientation='vertical'/>
                    <Button variant={'ghost'} title='Déconnecter' className='h-12 w-12' onClick={()=>mutation.mutate()}>
                        <LogOut size={22} className={'text-red-400'}/>
                    </Button>
                </div>

            </div>

            <ProfileComponent/>
        </nav>
    )
}