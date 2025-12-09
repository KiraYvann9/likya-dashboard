'use client'

// import './nav.css'
import { useUserStore } from "@/stores/useUserStore";


import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";


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
import { ProfileComponent } from "@/components";
import { logout } from '../../services/auth_actions';
import { Separator } from '../ui/separator';
import { getUserProfile } from '@/services/service';
import { useEffect } from 'react';

import {useProfileSheet} from "@/stores/useProfileSheet";

export const NavComponent = () => {
    const clearCurrentUserData = useUserStore(s => s.clearUser)
    const { user } = useUserStore()
    const router = useRouter()

    const openModal = useProfileSheet(s => s.openModal)

    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            // Clear client-side auth helper cookies used by proxy
            try {
                document.cookie = 'authenticated=; Max-Age=0; path=/';
                document.cookie = 'is_superuser=; Max-Age=0; path=/';
            } catch (e) {
                console.warn('Unable to clear auth cookies', e);
            }
            router.push('/')
            clearCurrentUserData()
            toast.success('Vous êtes déconnecté')

        }
    })

    const { data: connectedUserProfileInfo } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const response = await getUserProfile()
            return response.data
        },
        enabled: !!user?.id && user?.is_superuser === false,
    });

    useEffect(() => {
        if (connectedUserProfileInfo) {
            useUserStore.getState().setProfile(connectedUserProfileInfo);
        }
    }, [connectedUserProfileInfo, user?.id]);

    return (
        <nav className={'nav'}>
            <div className={'w-full flex items-center justify-end '}>
                

                <div className='flex gap-2 bg-white rounded-2xl overflow-hidden h-12 bg-gradient-to-br from-white to-white/5 border border-white shadow-sm'>
                    <span className='px-4 flex items-center font-medium'>
                        {
                            !user?.is_superuser && connectedUserProfileInfo ?  ` ${connectedUserProfileInfo.lastname || ''} ${connectedUserProfileInfo.firstname}` : 'Super Administrateur'
                        }
                    </span>

                    <Separator orientation='vertical' className='border-gray-500 h-full'/>

                    <DropdownMenu >
                        <DropdownMenuTrigger asChild className="flex"> 
                            <Button variant={'ghost'} className='h-12 w-auto p-0 mx-2 flex items-center outline-none'>
                                <Avatar className='h-10 w-10 bg-gray-800'>
                                    <AvatarImage src={user?.avatar || '/assets/avatar-placeholder.png'} alt='Profile Picture' />
                                    <AvatarFallback>{!user?.is_superuser && connectedUserProfileInfo?.firstname ? connectedUserProfileInfo.lastname.charAt(0) + connectedUserProfileInfo.firstname.charAt(0) : 'SA'}</AvatarFallback>
                                </Avatar>
                                <ChevronDown size={16} className='ml-1' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-56' align='end' forceMount>
                            <DropdownMenuLabel className='font-semibold'>
                                {
                                    !user?.is_superuser && connectedUserProfileInfo ?  ` ${connectedUserProfileInfo.lastname || ''} ${connectedUserProfileInfo.firstname}` : 'Super Administrateur'
                                }
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => openModal()}>
                                    <User size={16} className='mr-2' />
                                    Profil
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant={'ghost'} className='h-12 w-12'>
                        <Bell size={36} className={'text-muted-foreground'} />
                    </Button>
                    {/* <Button variant={'ghost'} className='h-12 w-12'>
                        <Settings size={22} className={'text-muted-foreground'} />
                    </Button> */}

                    <Separator orientation='vertical' />
                    <Button variant={'ghost'} title='Déconnecter' className='h-12 w-12' onClick={() => mutation.mutate()}>
                        <LogOut size={22} className={'text-red-400'} />
                    </Button>
                </div>

            </div>

            <ProfileComponent />
        </nav>
    )
}