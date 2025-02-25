'use client'

import {fetchData} from "@/services/service";
import {useQuery} from "@tanstack/react-query";
import {DataTable} from "@/components";
import {columns} from "@/app/(dashboard)/funding/_components/table/columns";
import { FundraisingModal } from "./_components/modal/FundraisingModal";

export default function FundingPage(){

    const getAllCollects = async() =>{
        const response = await fetchData('/collects');
        return response
    }

    const {data: collects, isLoading} = useQuery({
        queryKey: ['collects'],
        queryFn: getAllCollects
    })

    return(
        <div>
            <h1>Founding</h1>

            <DataTable data={collects?.items || []} columns={columns} isLoading={isLoading}/>
            <FundraisingModal/>
        </div> 
    )

}