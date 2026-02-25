"use client"

import * as React from "react"
import {
    ColumnDef,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { USerType } from "./TableSchema";
import ActionsButton from "./ActionsButton"

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
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <ActionsButton row={row} />,
    },
]