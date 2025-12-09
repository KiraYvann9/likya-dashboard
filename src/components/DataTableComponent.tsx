"use client"

import * as React from "react"
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable, ColumnDef,
} from "@tanstack/react-table"
import { ChevronDown, Columns3, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Spinner from "@/components/spinner";
import {Input} from "@/components/ui/input";

interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[],
    isLoading: boolean,
    filterBy?:string,
    filterPlaceholder?: string
}
export function DataTable<TData>({data, columns, isLoading, filterBy, filterPlaceholder}: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            {/* Header avec contrôles */}
            <div className="flex items-center justify-between py-4 px-1">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-[#1C8973] to-[#59AD96] rounded-lg p-2">
                        <Columns3 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Gestion des colonnes</p>
                        <p className="text-xs text-slate-500">Personnalisez l'affichage</p>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="gap-2 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                        >
                            <Columns3 className="h-4 w-4" />
                            Colonnes
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Tableau */}
            <div className="rounded-xl border border-emerald-200/60 overflow-hidden shadow-sm bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 hover:from-emerald-50 hover:to-teal-50 border-b border-emerald-200/60"
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="font-semibold text-slate-700"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={`
                                        hover:bg-emerald-50/30 transition-colors
                                        ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}
                                        ${row.getIsSelected() ? 'bg-emerald-100/50' : ''}
                                    `}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-slate-700">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-32 text-center"
                                >
                                    {isLoading ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Spinner />
                                            <p className="text-sm text-slate-500">Chargement des données...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="bg-slate-100 rounded-full p-3">
                                                <Columns3 className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="text-slate-600 font-medium">Aucun résultat trouvé</p>
                                            <p className="text-sm text-slate-400">Essayez de modifier vos filtres</p>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer avec pagination */}
            <div className="flex items-center justify-between py-4 px-1">
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-200/60 rounded-lg px-4 py-2">
                        <div className="h-2 w-2 rounded-full bg-[#1C8973]"></div>
                        <p className="text-sm font-medium text-slate-700">
                            {table.getFilteredSelectedRowModel().rows.length} sur{" "}
                            {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s)
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="gap-2 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                    </Button>
                    <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-md">
                        <span className="text-sm font-medium text-slate-700">
                            Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="gap-2 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}