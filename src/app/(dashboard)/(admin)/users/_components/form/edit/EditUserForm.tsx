'use client'

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {editProfileType, editUserFormSchema} from './editUserFormSchema'
import React from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-hot-toast";
import {Input} from "@/components/ui/input";


import 'react-phone-number-input/style.css'
import {Button} from "@/components/ui/button";
import {Calendar, Mail, MapPin, Phone, Plus, Save, X} from "lucide-react";
import {useUserModal} from "@/stores/useModalStore";
import Spinner from "@/components/spinner";
import api from "@/services/axiosConfig";

export const EditUserForm = () =>{

    const {closeModal, modalData}  = useUserModal()

    const form = useForm<editProfileType>({
        resolver: zodResolver(editUserFormSchema),
        defaultValues: {
            firstname: modalData ? modalData?.firstname : undefined,
            lastname: modalData? modalData?.lastname : undefined,
            email: modalData ? modalData?.email : undefined,
            contact: {
                phonenumber_one: modalData ? modalData?.contact : undefined,
                phonenumber_two: modalData ? modalData?.contact?.phonenumber_two : undefined,
            },
            address: {
                region: '',
                city: '',
                street: '',
                postal_code: '',
            },
            date_of_birth: ''

        },
    })

    const queryClient = useQueryClient()

    const getRoles = async()=>{
        const res = await api.get('/roles')
        return res.data?.items || []
    }

    const updateUser = async (data: editProfileType) =>{
        const req = await api.put(`/users/${modalData._id}`, data)
        return req.data
    }

    const mutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['users']})
            toast.success('Modifié avec succès !')
            form.reset()
            closeModal()
        },
        onError:(err) =>{
            toast.error(err?.message)
        }
    })

    const  onSubmit = async(data: editProfileType) => {
        mutation.mutate(data)
    }
    return(
        <div className="p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Section Informations personnelles */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
                            <h3 className="text-lg font-semibold text-foreground">Informations personnelles</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nom */}
                            <FormField
                                name="lastname"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium text-muted-foreground">
                                            Nom <span className="text-red-500 ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                className="h-12 bg-muted/50 border-border hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                                                placeholder="Nom de famille"
                                                disabled={mutation.isPending}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-sm" />
                                    </FormItem>
                                )}
                            />

                            {/* Prénom */}
                            <FormField
                                name="firstname"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium text-muted-foreground">
                                            Prénom(s) <span className="text-red-500 ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                className="h-12 bg-muted/50 border-border hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                                                placeholder="Prénom(s)"
                                                disabled={mutation.isPending}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-sm" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Email */}
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-medium text-muted-foreground flex items-center gap-2">
                                        <Mail size={16} />
                                        Email <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            className="h-12 bg-muted/50 border-border hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                                            placeholder="exemple@email.com"
                                            disabled={mutation.isPending}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm" />
                                </FormItem>
                            )}
                        />

                        {/* Date de naissance */}
                        <FormField
                            name="date_of_birth"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-medium text-muted-foreground flex items-center gap-2">
                                        <Calendar size={16} />
                                        Date de naissance <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="date"
                                            className="h-12 bg-muted/50 border-border hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                                            disabled={mutation.isPending}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Section Contact */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-emerald-600 to-emerald-400 rounded-full"></div>
                            <h3 className="text-lg font-semibold text-foreground">Contact</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Téléphone 1 */}
                            <FormField
                                name="contact.phonenumber_one"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium text-muted-foreground flex items-center gap-2">
                                            <Phone size={16} />
                                            Téléphone principal <span className="text-red-500 ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="tel"
                                                className="h-12 bg-muted/50 border-border hover:border-emerald-400 focus:border-emerald-500 transition-colors"
                                                placeholder="+225..."
                                                disabled={mutation.isPending}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-sm" />
                                    </FormItem>
                                )}
                            />

                            {/* Téléphone 2 */}
                            <FormField
                                name="contact.phonenumber_two"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium text-muted-foreground flex items-center gap-2">
                                            <Phone size={16} />
                                            Téléphone secondaire
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="tel"
                                                className="h-12 bg-muted/50 border-border hover:border-emerald-400 focus:border-emerald-500 transition-colors"
                                                placeholder="+225... (optionnel)"
                                                disabled={mutation.isPending}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-sm" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Section Adresse */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                            <h3 className="text-lg font-semibold text-foreground">Adresse</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Région */}
                            <FormField
                                name="address.region"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium text-muted-foreground flex items-center gap-2">
                                            <MapPin size={16} />
                                            Région <span className="text-red-500 ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                className="h-12 bg-muted/50 border-border hover:border-blue-400 focus:border-blue-500 transition-colors"
                                                placeholder="Région"
                                                disabled={mutation.isPending}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-sm" />
                                    </FormItem>
                                )}
                            />

                            {/* Ville */}
                            <FormField
                                name="address.city"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium text-muted-foreground flex items-center gap-2">
                                            <MapPin size={16} />
                                            Ville <span className="text-red-500 ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                className="h-12 bg-muted/50 border-border hover:border-blue-400 focus:border-blue-500 transition-colors"
                                                placeholder="Ville"
                                                disabled={mutation.isPending}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-sm" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Rue */}
                        <FormField
                            name="address.street"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-medium text-muted-foreground">
                                        Rue <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            className="h-12 bg-muted/50 border-border hover:border-blue-400 focus:border-blue-500 transition-colors"
                                            placeholder="Nom de la rue"
                                            disabled={mutation.isPending}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm" />
                                </FormItem>
                            )}
                        />

                        {/* Code postal */}
                        <FormField
                            name="address.postal_code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-medium text-muted-foreground">
                                        Code postal
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            className="h-12 bg-muted/50 border-border hover:border-blue-400 focus:border-blue-500 transition-colors"
                                            placeholder="Code postal (optionnel)"
                                            disabled={mutation.isPending}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <Button
                            onClick={closeModal}
                            type="button"
                            variant="outline"
                            className="gap-2 h-12 px-6 border-2 border-border hover:bg-muted transition-all"
                            disabled={mutation.isPending}
                        >
                            <X size={20} />
                            <span className="font-medium">Fermer</span>
                        </Button>

                        <Button
                            type="submit"
                            className="gap-2 h-12 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <>
                                    <Spinner />
                                    <span>Mise à jour...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span className="font-semibold">Mettre à jour</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}