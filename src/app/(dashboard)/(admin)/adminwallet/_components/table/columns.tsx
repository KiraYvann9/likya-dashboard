"use client"

import * as React from "react"
import {
    ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { USerType } from "./TableSchema";
import { SwitchComponent } from "@/components";
import ActionsButton from "./ActionsButton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
        accessorKey: "wallet_ref",
        header: () => <div className={'text-left'}>Ref. Wallet</div>,
        cell: ({ row }) => <div className="lowercase">{row.getValue("wallet_ref")}</div>,
    },
    // {
    //     accessorKey: "user_id",
    //     header: "Utilisateur ID",
    //     cell: ({ row }) => (
    //         <div className="capitalize">{row.getValue("user_id")}</div>
    //     ),
    // },
    {
        accessorKey: "balance",
        header: "Montant",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("balance")}</div>
        ),
    },
    {
        accessorKey: "currency",
        header: () => <div className={'text-left'}>Devise</div>,
        cell: ({ row }) => <div className="lowercase">{row.getValue("currency")}</div>,
    },
    {
        accessorKey: "status",
        header: () => <div className={'text-left'}>Status</div>,
        cell: ({ row }) => <div className="lowercase">
            <Badge className={cn( row.getValue("status") === 'active' ? 'bg-green-500' :'default', 'border-none' )}>
                {row.getValue("status")}
            </Badge>
            </div>,
    },
    {
        accessorKey: "created_at",
        header: () => <div className={'text-left'}>Date De Création</div>,
        cell: ({ row }) => {
            const createdAt = new Date(row.getValue("created_at"));
            return (
                <div className="lowercase">{
                    new Intl.DateTimeFormat("fr", {
                        timeStyle: 'medium',
                        dateStyle: 'medium'
                    }).format(createdAt)
                }
                </div>
            )
        }
    },
    // {
    //     accessorKey: "is_active",
    //     header: () => <div className="text-center">Status</div>,
    //     cell: ({ row }) => {
    //         return <div className="text-center font-medium">
    //             <SwitchComponent status={row.getValue('is_active')} id={row.getValue('_id')} />
    //         </div>
    //     },
    // },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <ActionsButton row={row} />,
    },
]