'use client';

import { DataTable } from "@/components";
import { CardComponent } from "@/components/CardComponent";
import api from "@/services/axiosConfig";
import { useQuery } from "@tanstack/react-query";

import {columns} from "./_components/table/columns";

export default function AdminWalletPage() {

    const getWallet = async () =>{
        const response = await api.get(`/admin/wallets`);
        return response.data;
    }
    
    const {data: walletData, isLoading} = useQuery({
        queryKey: ['all-wallet'],
        queryFn: getWallet,
    });

    return (
        <CardComponent className={"w-full min-h-[70vh] p-6"}>
            <h1>Wallets</h1>

            <DataTable columns={columns} data={ walletData?.items || []} isLoading={isLoading}/>
        </CardComponent>
    )
}