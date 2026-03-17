"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { useCategoryModal } from "@/stores/useModalStore";
import { CategoryForm } from "../form/CategoryForm";
import { Plus, Edit3, Eye } from "lucide-react";

export function CategoryModal() {
    const { isOpen, closeModal, status } = useCategoryModal();

    const getHeaderIcon = () => {
        if (status === 'CREATE') return <Plus className="h-5 w-5 text-white" />
        if (status === 'EDIT') return <Edit3 className="h-5 w-5 text-white"/>
        return <Eye className="h-5 w-5 text-white" />
    }

    const getHeaderColor = () => {
        if (status === 'CREATE') return 'from-[#1C8973] to-[#59AD96]'
        if (status === 'EDIT') return 'from-blue-600 to-indigo-700'
        return 'from-[#1C8973] to-[#59AD96]'
    }

    const getTitle = () => {
        if (status === 'CREATE') return "Créer une catégorie";
        if (status === 'EDIT') return "Modifier la catégorie";
        return "Détails de la catégorie";
    }

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-[550px] w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-0 overflow-hidden border-0">
                <div className={`bg-gradient-to-r ${getHeaderColor()} px-6 py-6`}>
                    <DialogHeader className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                {getHeaderIcon()}
                            </div>
                            <div className="text-white">
                                <DialogTitle className="text-xl font-bold">
                                    {getTitle()}
                                </DialogTitle>
                                <DialogDescription className="text-white/80">
                                    Remplissez les informations ci-dessous
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>
                <div className="p-4">
                    <CategoryForm />
                </div>
            </DialogContent>
        </Dialog>
    );
}
