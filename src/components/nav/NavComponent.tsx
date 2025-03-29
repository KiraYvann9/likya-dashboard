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
    ChevronDown
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
            <div className={'flex items-center'}>
                {user && user?.fullname}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className={'flex items-center'}>
                            <Button variant="ghost">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Button>
                            <ChevronDown size={22} className={'text-muted-foreground'}/>
                        </div>

                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={openModal}>
                                <User />
                                <span>Profile</span>
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Settings />
                                <span>Settings</span>
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={()=>mutation.mutate()}>
                            <LogOutIcon/>
                            <span>Déconnexion</span>
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

            <ProfileComponent/>
        </nav>
    )
}