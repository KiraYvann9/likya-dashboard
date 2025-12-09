'use client'

import {useQuery} from "@tanstack/react-query";
import {DataTable} from "@/components";
import {columns} from "./_components/table/columns";
import { FundraisingModal } from "./_components/modal/FundraisingModal";
import { CardComponent } from "@/components/CardComponent";
import api from "@/services/axiosConfig";
import { useState, useMemo } from "react";
import FilterComponent from "./_components/FilterComponent";

export default function FundingPage(){

    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<"asc" | "desc" | "">("");
    const [author, setAuthor] = useState<string>("");
    const [categories, setCategories] = useState<string>("");
    const [access, setAccess] = useState<"public" | "private" | "">("");
    const [status, setStatus] = useState<"draft" | "actived" | "paused" | "completed" | "cancelled" | "">("");
    const [page, setPage] = useState<number | undefined>(undefined);
    const [size, setSize] = useState<number | undefined>(undefined);
    const [authorization, setAuthorization] = useState<string>("");

    const queryParams = useMemo(() => {
        const params: Record<string, any> = {};
        if (search) params.search = search;
        if (sort) params.sort = sort;
        if (author) params.author = author;
        if (categories) params.categories = categories; // comma-separated for multiple
        if (access) params.access = access;
        if (status) params.status = status; // single status; support comma-separated via categories-like if needed
        if (typeof page === 'number') params.page = page;
        if (typeof size === 'number') params.size = size;
        if (authorization) params.authorization = authorization;
        return params;
    }, [search, sort, author, categories, access, status, page, size, authorization]);

    const getAllCollects = async() =>{
        const response = await api.get('/admin/cagnottes', { params: queryParams });
        return response.data
    }

    const {data: collects, isLoading, refetch} = useQuery({
        queryKey: ['collects', queryParams],
        queryFn: getAllCollects,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        staleTime: 1000 * 60 * 5
    })

    const onReset = () => {
        setSearch("");
        setSort("");
        setAuthor("");
        setCategories("");
        setAccess("");
        setStatus("");
        setPage(undefined);
        setSize(undefined);
        setAuthorization("");
        refetch();
    }

    return(
        <CardComponent className={'flex flex-col gap-6 w-full '}>
            <h1>Collecte</h1>

            <FilterComponent
                search={search}
                setSearch={setSearch}
                sort={sort}
                setSort={setSort}
                author={author}
                setAuthor={setAuthor}
                categories={categories}
                setCategories={setCategories}
                access={access}
                setAccess={setAccess}
                status={status}
                setStatus={setStatus}
                page={page}
                setPage={setPage}
                size={size}
                setSize={setSize}
                authorization={authorization}
                setAuthorization={setAuthorization}
                onReset={onReset}
            />
            <div className={'flex flex-col gap-4 p-6 w-full shadow-lg'}>
                <h2 className={'text-xl font-bold'}>Liste des cagnottes</h2>
                <DataTable
                    filterBy={'title'}
                    filterPlaceholder={'Filtre par titre de la cagnotte'}
                    data={collects?.items || []}
                    columns={columns}
                    isLoading={isLoading}
                />
            </div>
            <FundraisingModal/>
        </CardComponent> 
    )

}