'use client'

import {fetchData} from "@/services/service";
import {useQuery} from "@tanstack/react-query";
import {DataTable} from "@/components";
import {columns} from "./_components/table/columns";

export default function LogPage(){

    const getLogs = async () =>{
        const response = await fetchData('/logs')
        return response.items
    }

    const {data, isLoading } = useQuery({
        queryKey: ['logs'],
        queryFn: getLogs
    })

    console.warn('logs :', data)

    return(
        <div>
            <h1>Log</h1>

            <DataTable filterPlaceholder={'Rechercher par ID'} filterBy={'user_id'} data={data || []} columns={columns} isLoading={isLoading}/>
        </div>
    )
}