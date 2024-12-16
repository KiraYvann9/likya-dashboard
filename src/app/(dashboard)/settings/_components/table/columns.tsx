"use client"

import * as React from "react"
import {
    ColumnDef,
} from "@tanstack/react-table"
import {ArrowUpDown, MoreHorizontal} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {USerType} from "./TableSchema";
import {SwitchComponent} from "@/components";
import {useUserModal} from "@/stores/useModalStore";


export const columns: ColumnDef<USerType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                    <ArrowUpDown/>
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{}</div>
        ),
    },
    {
        accessorKey: "fullname",
        header: "Nom et prénoms",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("fullname")}</div>
        ),
    },
    {
        accessorKey: "phonenumber",
        header: () => <div className={'text-left'}>N° Téléphone</div>,
        cell: ({ row }) => <div className="lowercase">{row.getValue("phonenumber")}</div>,
    },
    {
        accessorKey: "email",
        header: () => <div className="text-center">E-mail</div>,
        cell: ({ row }) => {

            return <div className="text-center font-medium">{row.getValue('email')}</div>
        },
    },
    {
        accessorKey: "extras",
        header: () => <div className="text-center">Rôle</div>,
        cell: ({ row }) => {
            const role = row.original.extras.role_info.name
            return <div className="font-medium">{role}</div>
        },
    },
    {
        accessorKey: "is_active",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {

            return <div className="text-right font-medium">
                <SwitchComponent status={row.getValue('is_active')} id={row.getValue('_id')}/>
            </div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original
            const openModal = useUserModal.getState().openModal
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment._id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={()=>openModal('DETAIL', row.original)}>Détail</DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>openModal('EDIT',row.original)}>Modifier</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]