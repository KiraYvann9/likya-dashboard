"use client"

import * as React from "react"
import {
    ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {createPartnersFormSchema} from "./TableSchema";
import { SwitchComponent } from "@/components";
import ActionsButton from "./ActionsButton"
import {StatusSwitch} from "@/app/(dashboard)/(admin)/patners/_components/StatusSwitch";

export const columns: ColumnDef<createPartnersFormSchema>[] = [
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
        accessorKey: "name",
        header: "Nom",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "contact.phone_number",
        header: () => <div className={'text-left'}>N° Téléphone</div>,
        cell: ({ row }) => <div className="lowercase">{row.original.contact.phone_number || 'N/A'}</div>,
    },
    {
        accessorKey: "contact.email",
        header: () => <div className={'text-left'}>Email</div>,
        cell: ({ row }) => <div className="lowercase">{row.original.contact.email || 'N/A'}</div>,
    },
    {
        accessorKey: "address",
        header: () => <div className={'text-left'}>Adresse</div>,
        cell: ({ row }) => <div className="lowercase">{ `${row.original.address.city} / ${row.original.address.country}` || 'N/A'}</div>,
    },
    {
        accessorKey: "establishment_type",
        header: () => <div className={'text-left'}>Type d'établissement</div>,
        cell: ({ row }) => <div className="lowercase">{ row.original.establishment_type || 'N/A'}</div>,
    },
    {
        accessorKey: "is_active",
        header: () => <div className={'text-left'}>Status</div>,
        cell: ({ row }) => <StatusSwitch status={row.original.is_active} id={row.original._id}/>,
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