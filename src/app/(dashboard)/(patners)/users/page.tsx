"use client"

import { DataTable } from "@/components";
import { CardComponent } from "@/components/CardComponent";
import { Button } from "@/components/ui/button";
import { User, UserPlus } from "lucide-react";
import { columns } from "./_components/table/columns";
import { UserModal } from "./_components/modal/UserModal/Modal";

import { usePrestataireUserModal } from '@/stores/useModalStore'

export default function UserPage() {

    const openModal = usePrestataireUserModal(state => state.openModal)
    return (
        <CardComponent className={"w-full min-h-[70vh] p-6"}>
            <div className={'settings_header mb-6 flex items-center justify-between'}>
                <h1 className='text-2xl font-semibold'>Utilisateurs</h1>
                <div className={'btn_container flex gap-2'}>
                    <Button
                        className="bg-custom_color-green hover:opacity-90 transition-all duration-300 px-6 py-6 text-base font-semibold rounded-lg text-white"
                        onClick={() => openModal('CREATE')}
                    >
                        <UserPlus size={20} className='mr-2' />
                        Créer un utilisateur
                    </Button>
                </div>
            </div>

            <DataTable
                filterBy={"firstname"}
                filterPlaceholder={'Filtre par Nom'}
                columns={columns} data={[]}
                isLoading={false}
            />

            <UserModal/>
        </CardComponent>
    )
}