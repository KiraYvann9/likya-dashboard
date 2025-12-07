'use client'

import {useQuery} from "@tanstack/react-query";
import {DataTable} from "@/components";
import {columns} from "./_components/table/columns";
import { FundraisingModal } from "./_components/modal/FundraisingModal";
import { CardComponent } from "@/components/CardComponent";
import api from "@/services/axiosConfig";

export default function FundingPage(){

    const getAllCollects = async() =>{
        const response = await api.get('/admin/cagnottes');
        return response.data
    }

    const {data: collects, isLoading} = useQuery({
        queryKey: ['collects'],
        queryFn: getAllCollects,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        staleTime: 1000 * 60 * 5
    })

    return(
        <CardComponent className={'flex flex-col gap-10 w-full '}>
            <h1>Collecte</h1>

            <DataTable
                filterBy={'title'}
                filterPlaceholder={'Filtre par titre de la cagnotte'}
                data={collects?.items || []}
                columns={columns}
                isLoading={isLoading}
            />
            <FundraisingModal/>
        </CardComponent> 
    )

}