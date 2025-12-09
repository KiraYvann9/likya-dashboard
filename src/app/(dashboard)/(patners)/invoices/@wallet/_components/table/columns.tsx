"use client"

import * as React from "react"
import {
    ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TransactionColumnsSchema } from "./schema";
import ActionsButton from "./ActionsButton"

export const columns: ColumnDef<TransactionColumnsSchema>[] = [
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
    // {
    //     accessorKey: "_id",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 ID
    //                 <ArrowUpDown />
    //             </Button>
    //         )
    //     },
    //     cell: ({ row }) => (
    //         <div className="capitalize">{row.index + 1}</div>
    //     ),
    // },
    {
        accessorKey: "lastname",
        header: "Nom",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("lastname")}</div>
        ),
    },
    {
        accessorKey: "firstname",
        header: "Prénom",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("firstname")}</div>
        ),
    },
    {
        accessorKey: "contact.phonenumber_one",
        header: () => <div className={'text-left'}>N° Téléphone</div>,
        cell: ({ row }) => <div className="lowercase">{row.getValue("contact.phonenumber_one") || 'N/A'}</div>,
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