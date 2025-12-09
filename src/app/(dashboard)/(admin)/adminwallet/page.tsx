'use client';

import {DataTable} from "@/components";
import {CardComponent} from "@/components/CardComponent";
import api from "@/services/axiosConfig";
import {useQuery} from "@tanstack/react-query";
import {useMemo, useState} from "react";

import {columns} from "./_components/table/columns";
import FilterComponent from "./_components/FilterComponent";

export default function AdminWalletPage() {

    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<"asc" | "desc" | "">("");
    const [status, setStatus] = useState<"enable" | "disable" | "locked" | "">("");
    const [created_gt, setCreated_gt] = useState<string>("");
    const [created_lt, setCreated_lt] = useState<string>("");
    const [created_gte, setCreated_gte] = useState<string>("");
    const [created_lte, setCreated_lte] = useState<string>("");
    const [page, setPage] = useState<number | undefined>(undefined);
    const [size, setSize] = useState<number | undefined>(undefined);
    const [authorization, setAuthorization] = useState<string>("");

    const queryParams = useMemo(() => {
        const params: Record<string, any> = {};
        if (search) params.search = search;
        if (sort) params.sort = sort;
        if (status) params.status = status;
        if (created_gt) params.created_gt = created_gt;
        if (created_lt) params.created_lt = created_lt;
        if (created_gte) params.created_gte = created_gte;
        if (created_lte) params.created_lte = created_lte;
        if (typeof page === 'number') params.page = page;
        if (typeof size === 'number') params.size = size;
        if (authorization) params.authorization = authorization;
        return params;
    }, [search, sort, status, created_gt, created_lt, created_gte, created_lte, page, size, authorization]);

    const getWallet = async () => {
        const response = await api.get(`/admin/wallets`, {params: queryParams});
        return response.data;
    }

    const {data: walletData, isLoading, refetch} = useQuery({
        queryKey: ['all-wallet', queryParams],
        queryFn: getWallet,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        staleTime: 1000 * 60 * 5,
    });

    const onReset = () => {
        setSearch("");
        setSort("");
        setStatus("");
        setCreated_gt("");
        setCreated_lt("");
        setCreated_gte("");
        setCreated_lte("");
        setPage(undefined);
        setSize(undefined);
        setAuthorization("");
        refetch();
    }

    return (
        <CardComponent className={"w-full min-h-[70vh] p-6 flex flex-col gap-6"}>
            <h1 className={'text-2xl font-bold text-gray-900'}>Wallets</h1>

            <FilterComponent
                search={search}
                setSearch={setSearch}
                sort={sort}
                setSort={setSort}
                status={status}
                setStatus={setStatus}
                created_gt={created_gt}
                setCreated_gt={setCreated_gt}
                created_lt={created_lt}
                setCreated_lt={setCreated_lt}
                created_gte={created_gte}
                setCreated_gte={setCreated_gte}
                created_lte={created_lte}
                setCreated_lte={setCreated_lte}
                page={page}
                setPage={setPage}
                size={size}
                setSize={setSize}
                authorization={authorization}
                setAuthorization={setAuthorization}
                onReset={onReset}
            />

            <div className={'flex flex-col gap-4 p-6 w-full shadow-lg'}>
                <h2 className={'text-xl font-bold'}>Liste des wallets</h2>
                <DataTable columns={columns} data={walletData?.items || []} isLoading={isLoading}/>
            </div>

        </CardComponent>
    )
}