
import {ChartPie, History, Home, LucideIcon, QrCode, Ticket, UserRoundCog, UsersRound} from 'lucide-react'

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
        id:  2,
        title: 'Utilisateurs',
        icon: UsersRound,
        link: "/users",
        permission: ['prestataire']
    },
    {
        id:  3,
        title: 'Historique',
        icon: History,
        link: "/history",
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
        id:  5,
        title: 'Factures',
        icon: Ticket,
        link: "/invoices",
        permission: ['prestataire']
    },
    {
        id:  6,
        title: 'QRCode',
        icon: QrCode,
        link: "/qrcode",
        permission: ['prestataire']
    },
    // {
    //     id:  7,
    //     title: 'Services',
    //     icon: Stethoscope,
    //     link: "/qrcode",
    //     permission: ['prestataire']
    // },
    // {
    //     id:  8,
    //     title: 'Medicaments',
    //     icon: Pill,
    //     link: "/qrcode",
    //     permission: ['prestataire']
    // },

]