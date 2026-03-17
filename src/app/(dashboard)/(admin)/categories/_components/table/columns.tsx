"use client"

import * as React from "react"
import {
    ColumnDef,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { CategoryType } from "./CategorySchema";
import ActionsButton from "./ActionsButton"

export const columns: ColumnDef<CategoryType>[] = [
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
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="max-w-[300px] truncate">{row.getValue("description") || 'N/A'}</div>
        ),
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => <div className="lowercase">{row.getValue("slug")}</div>,
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
