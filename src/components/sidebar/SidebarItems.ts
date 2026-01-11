
import {
    ChartPie,
    HandCoins,
    History,
    Hospital,
    LucideIcon,
    QrCode, Settings, Shield,
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
    subItems?: sidebarItemType[]
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
        permission: ["superuser"],
        subItems: [
            {
                id: 10,
                title: 'Registre',
                icon: QrCode,
                link: "/adminwallet/withdraw",
                permission: ["superuser"]
            },
            {
                id: 11,
                title: 'Frais',
                icon: UserRoundCog,
                link: "/adminwallet/fees",
                permission: ["superuser"]
            },
            {
                id: 12,
                title: 'limites',
                icon: UserRoundCog,
                link: "/adminwallet/limits",
                permission: ["superuser"]
            }

        ]
    },
    {
        id:  3,
        title: 'Transactions',
        icon: History,
        link: "/transactions",
        permission: ['superuser']
    },
    {
        id:  2,
        title: 'Utilisateurs',
        icon: UsersRound,
        link: "/users",
        permission: ['superuser']
    },
    {
        id:  4,
        title: 'Rôle & Permissions',
        icon: Shield,
        link: "/roles-permissions",
        permission: ['superuser']
    },
    {
        id:  6,
        title: 'Etablissements',
        icon: Hospital,
        link: "/patners",
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
    const userRole = user?.roles?.[0]?.slug || user?.roles?.[0]?.name

    return SidebarItems.filter(item => {

        if(!item.permission || item.permission.length === 0) return true

        if(isSuperUser) {
            return item.permission.includes('superuser')
        }

        if(!isSuperUser && item.permission.includes('prestataire')) return true

        if(userRole && item.permission.includes(userRole)) return true

        return false
    })
}

export default SidebarItems