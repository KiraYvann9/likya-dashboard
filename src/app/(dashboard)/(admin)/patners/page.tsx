"use client"

import { DataTable } from "@/components";
import { CardComponent } from "@/components/CardComponent";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { columns } from "./_components/table/columns";
import { UserModal } from "./_components/modal/UserModal/Modal";

import { useUserModal } from '@/stores/useModalStore'
import { useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/services/axiosConfig";

export default function UserPage() {

    const openModal = useUserModal(state => state.openModal)

    const getAllProfiles =async ()=>{
        const response = await api.get('/establishments')
        return response.data
    }


    const {data: profiles, isLoading } = useQuery({
        queryKey: ['partners'],
        queryFn: getAllProfiles,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })


    return (
        <CardComponent className={"w-full min-h-[70vh] p-6"}>
            <div className={'settings_header mb-6 flex flex-col gap-8'}>
                <h1 className='text-2xl font-semibold'>Etablissements</h1>
                <div className={'flex justify-between mb-6'}>
                    <h3 className={'text-xl font-semibold text-gray-800 mb-4'}>Liste des établisssements <strong className={'text-custom_color-green'}>[{profiles && profiles.total}]</strong></h3>
                    <div className={'btn_container flex gap-2'}>
                        <Button
                            className="bg-custom_color-green hover:opacity-90 transition-all duration-300 px-6 py-6 text-base font-semibold rounded-lg text-white"
                            onClick={()=>openModal('CREATE')}
                        >
                            {/*<UserPlus size={20} className='mr-2'/>*/}
                            Ajouter un établissement
                        </Button>
                    </div>
                </div>
            </div>

            <DataTable
                filterBy={"firstname"}
                filterPlaceholder={'Filtre par Nom'}
                columns={columns} data={profiles?.items || []}
                isLoading={isLoading}
            />

            <UserModal/>
        </CardComponent>
    )
}