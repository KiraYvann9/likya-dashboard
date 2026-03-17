"use client"

import { DataTable } from "@/components";
import { CardComponent } from "@/components/CardComponent";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./_components/table/columns";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/axiosConfig";
import { CategoryResponse } from "./_components/table/CategorySchema";
import { useCategoryModal } from "@/stores/useModalStore";
import { CategoryModal } from "./_components/modal/CategoryModal";

export default function CategoryPage() {

    const openModal = useCategoryModal(state => state.openModal)

    const getAllCategories = async (): Promise<CategoryResponse> => {
        const response = await api.get('/categories')
        return response.data
    }

    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getAllCategories,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })

    return (
        <CardComponent className={"w-full min-h-[70vh] p-6"}>
            <div className={'settings_header mb-6 flex flex-col gap-8'}>
                <h1 className='text-2xl font-semibold'>Catégories</h1>
                <div className={'flex justify-between mb-6'}>
                    <h3 className={'text-xl font-semibold text-gray-800 mb-4'}>Liste des catégories <strong className={'text-custom_color-green'}>[{data && data.total}]</strong></h3>
                    <div className={'btn_container flex gap-2'}>
                        <Button
                            className="bg-custom_color-green hover:opacity-90 transition-all duration-300 px-6 py-6 text-base font-semibold rounded-lg text-white"
                            onClick={() => openModal('CREATE')}
                        >
                            <Plus size={20} className='mr-2'/>
                            Créer une catégorie
                        </Button>
                    </div>
                </div>
            </div>

            <DataTable
                filterBy={"name"}
                filterPlaceholder={'Filtre par Nom'}
                columns={columns} data={data?.items || []}
                isLoading={isLoading}
            />

            <CategoryModal />
        </CardComponent>
    )
}
