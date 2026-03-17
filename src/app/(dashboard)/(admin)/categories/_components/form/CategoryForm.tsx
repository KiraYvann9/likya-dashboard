"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryFormSchema, CategoryFormValues } from "./CategoryFormSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/axiosConfig";
import { toast } from "react-hot-toast";
import { useCategoryModal } from "@/stores/useModalStore";
import { useEffect } from "react";
import Spinner from "@/components/spinner";

export const CategoryForm = () => {
    const { status, modalData, closeModal } = useCategoryModal();
    const queryClient = useQueryClient();

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: "",
            description: "",
            parent_id: null,
        },
    });

    useEffect(() => {
        if ((status === 'EDIT' || status === 'DETAIL') && modalData) {
            form.reset({
                name: modalData.name || "",
                description: modalData.description || "",
                parent_id: modalData.parent_id || null,
            });
        }
    }, [status, modalData, form]);

    const mutation = useMutation({
        mutationFn: async (values: CategoryFormValues) => {
            if (status === 'EDIT') {
                return await api.put(`/categories/${modalData._id}`, values);
            }
            return await api.post('/categories', values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success(`Catégorie ${status === 'EDIT' ? 'modifiée' : 'créée'} avec succès !`);
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Une erreur est survenue");
        }
    });

    const onSubmit = (values: CategoryFormValues) => {
        mutation.mutate(values);
    };

    const isReadOnly = status === 'DETAIL';

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 py-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom de la catégorie</FormLabel>
                            <FormControl>
                                <Input placeholder="Electronique, Mode, etc." {...field} disabled={isReadOnly} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Description de la catégorie" {...field} disabled={isReadOnly} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {!isReadOnly && (
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Annuler
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-custom_color-green hover:opacity-90"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? <Spinner /> : (status === 'EDIT' ? 'Modifier' : 'Créer')}
                        </Button>
                    </div>
                )}
            </form>
        </Form>
    );
};
