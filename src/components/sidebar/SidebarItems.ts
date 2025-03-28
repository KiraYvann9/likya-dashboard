
import {
    ChartPie,
    HandCoins,
    History,
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
    permission?: string[]
}

export const SidebarItems: sidebarItemType[] = [
    {
        id:  1,
        title: 'Dashboard',
        icon: ChartPie,
        link: "/dashboard",
        permission: ['super-administrateur']
    },
    {
        id:  5,
        title: 'Wallet',
        icon: Wallet,
        link: "/invoices",
        permission: ['prestataire']
    },
    // {
    //     id:  2,
    //     title: 'Utilisateurs',
    //     icon: UsersRound,
    //     link: "/users",
    //     permission: ['prestataire']
    // },
    {
        id:  3,
        title: 'Historique',
        icon: History,
        link: "/transactions",
        permission: ['super-administrateur']
    },
    {
        id:  4,
        title: 'Paramètres',
        icon: UserRoundCog,
        link: "/settings",
        permission: ['super-administrateur']
    },
    {
        id:  6,
        title: 'QRCode',
        icon: QrCode,
        link: "/qrcode",
        permission: ['prestataire']
    },
    {
        id:  7,
        title: 'Collecte',
        icon: HandCoins,
        link: "/funding",
        permission: ['super-administrateur']
    },
    {
        id:  8,
        title: 'Log',
        icon: SquareActivity,
        link: "/log",
        permission: ['super-administrateur']
    },

]