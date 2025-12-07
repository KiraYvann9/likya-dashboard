'use client'

import {useQuery} from "@tanstack/react-query";
import {DataTable} from "@/components";
import {columns} from "./_components/table/columns";
import { CardComponent } from "@/components/CardComponent";
import api from "@/services/axiosConfig";

export default function LogPage(){

    const getLogs = async () =>{
        const response = await api.get('/logs')
        return response.data
    }

    const {data, isLoading } = useQuery({
        queryKey: ['logs'],
        queryFn: getLogs
    })

    console.warn('logs :', data)

    return(
        <CardComponent className={'flex flex-col gap-10 w-full '}>
            <h1>Log</h1>

            <DataTable filterPlaceholder={'Rechercher par ID'} filterBy={'user_id'} data={data || []} columns={columns} isLoading={isLoading}/>
        </CardComponent>
    )
}