
import {
    ChartPie,
    HandCoins,
    History,
    Hospital,
    LucideIcon,
    QrCode,
    SquareActivity,
    UserRoundCog,
    UsersRound,
    Wallet
} from 'lucide-react'

export interface sidebarItemType {
    id: number;
    title: string;
    link: string;
    icon: LucideIcon,
    permission?: string[],
    
}

export const SidebarItems: sidebarItemType[] = [
    {
        id:  1,
        title: 'Dashboard',
        icon: ChartPie,
        link: "/dashboard",
        permission: ['superuser','prestataire'],

    },
    {
        id:  5,
        title: 'Wallet',
        icon: Wallet,
        link: "/invoices",
        permission: ["prestataire"]
    },
    {
        id:  9,
        title: 'Wallet',
        icon: Wallet,
        link: "/adminwallet",
        permission: ["superuser"]
    },
    {
        id:  2,
        title: 'Utilisateurs',
        icon: UsersRound,
        link: "/users",
        permission: ['prestataire']
    },
    // {
    //     id:  3,
    //     title: 'Historique',
    //     icon: History,
    //     link: "/transactions",
    //     permission: ['superuser']
    // },
    {
        id:  4,
        title: 'Paramètres',
        icon: UserRoundCog,
        link: "/settings",
        permission: ['superuser']
    },
    {
        id:  6,
        title: 'Etablissements',
        icon: Hospital,
        link: "/establishments",
        permission: ['superuser']
    },
    {
        id:  7,
        title: 'Collecte',
        icon: HandCoins,
        link: "/funding",
        permission: ['superuser']
    },
    {
        id:  8,
        title: 'Log',
        icon: SquareActivity,
        link: "/log",
        permission: ['superuser']
    },

]

// Helper to get sidebar items based on the current user
export const getSidebarItems = (user?: any) : sidebarItemType[] =>{
    const isSuperUser = !!user?.is_superuser
    const userRole = user?.roles[0]?.slug || user?.roles[0]?.name

    return SidebarItems.filter(item => {
        // if item has no permission field, show to everyone
        if(!item.permission || item.permission.length === 0) return true
        // if super user, allow everything
        if(isSuperUser && item.permission.includes('superuser')) return true
        // otherwise check if user's role is included
        if(userRole && item.permission.includes(userRole)) return true
        return false
    })
}

export default SidebarItems