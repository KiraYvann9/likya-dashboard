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
import {Schema} from "./schema";
import {SwitchComponent} from "@/components";
import {useUserModal} from "@/stores/useModalStore";

import {format} from "date-fns"


export const columns: ColumnDef<Schema>[] = [
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
        accessorKey: "user_id",
        header: "User ID",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("user_id")}</div>
        ),
    },
    {
        accessorKey: "source",
        header: () => <div className={'text-left'}>Source</div>,
        cell: ({ row }) => <div className="lowercase">{row.getValue("source")}</div>,
    },
    {
        accessorKey: "message",
        header: () => <div className="text-center">Message</div>,
        cell: ({ row }) => {
            return <div className="text-center font-medium">{row.getValue('message')}</div>
        },
    },
    {
        accessorKey: "created",
        header: () => <div className="text-center">Date</div>,
        cell: ({ row }) => {
            return <div className="text-center font-medium">{format(row.getValue('created'), 'dd/MM/yyyy')}</div>
        },
    },
    {
        accessorKey: "device",
        header: () => <div className="text-center">Device</div>,
        cell: ({ row }) => {

            return <div className="text-center font-medium">{row.getValue('device')}</div>
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