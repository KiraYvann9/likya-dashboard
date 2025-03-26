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
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown/>
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">
                {new Intl.DateTimeFormat("fr",{dateStyle: 'medium'} )
                    .format(new Date(row.getValue('created_at')))
                }
            </div>
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
        accessorKey: "contributors",
        header: () => <div className="text-center">Contributeurs</div>,
        cell: ({ row }) => {
            const contributors: Array<string> = row.getValue('contributors')
            return <div className="text-center font-medium">{contributors.length}</div>
        },
    },
    {
        accessorKey: "owner_info",
        header: () => <div className="text-center">Créer par</div>,
        cell: ({ row }) => {
            const owner: { fullname: string } = row.getValue("owner_info")
            return <div className="text-center font-medium">{owner.fullname}</div>
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
                        <DropdownMenuItem onClick={()=>null}>Détail</DropdownMenuItem>
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