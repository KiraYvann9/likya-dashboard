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
import {cn} from "@/lib/utils";
import { useFundraisingModalStore } from "@/stores/useFundraisingModalStore"


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
        accessorKey: "title",
        header: "Titre",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("title")}</div>
        ),
    },
    {
        accessorKey: "description",
        header: () => <div className={'text-left'}>Description</div>,
        cell: ({ row }) => <div className="lowercase">{row.getValue("description")}</div>,
    },
    {
        accessorKey: "target_amount",
        header: () => <div className="text-center">Montant</div>,
        cell: ({ row }) => {
            return <div className="text-center font-medium">{row.getValue('target_amount')}</div>
        },
    },
    {
        accessorKey: "created_by",
        header: () => <div className="text-center">Créer par</div>,
        cell: ({ row }) => {

            return <div className="text-center font-medium">{row.getValue('created_by')}</div>
        },
    },
    {
        accessorKey: "created_at",
        header: () => <div className="text-center">Date création</div>,
        cell: ({ row }) => {
            return <div className="text-center font-medium">{format(row.getValue('created_at'), 'dd/MM/yyyy')}</div>
        },
    },
    {
        accessorKey: "status",
        header: ()=> <div className={'text-center'}>Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status");
            return <div className="flex justify-center items-center font-medium">
                <div className={cn('text-[12px] w-3 h-3 bg-yellow-400 rounded-full', status =='validate'&&'bg-green-400', status =='reject'&&'bg-red-400')}/>
            </div>
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original
            const openModal = useUserModal.getState().openModal

            const confirm = useFundraisingModalStore.getState().openModal
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
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={()=>confirm("VALIDATE", {id:row.getValue('_id'), title: row.getValue('title')})}>Valider <div className={'w-2 h-2 rounded-full bg-green-400'}/> </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => confirm("REJECT", {id:row.getValue('_id'), title: row.getValue('title')})}
                                          className={'text-red-500'}>Rejeter <div
                            className={'w-2 h-2 rounded-full bg-red-400'}/></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]