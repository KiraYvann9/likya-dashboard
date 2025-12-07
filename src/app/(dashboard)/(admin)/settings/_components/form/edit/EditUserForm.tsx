'use client'

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {editUserFormSchema} from './editUserFormSchema'
import React from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {z} from "zod";
import {toast} from "react-hot-toast";
import {Input} from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import './form.css'

import 'react-phone-number-input/style.css'
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useUserModal} from "@/stores/useModalStore";
import Spinner from "@/components/spinner";
import api from "@/services/axiosConfig";

export const EditUserForm = () =>{

    const {closeModal, modalData}  = useUserModal()
    const form = useForm({
        resolver: zodResolver(editUserFormSchema),
        defaultValues: {
            username: modalData ? modalData?.username : undefined,
            roles: modalData? modalData?.role : undefined,
            attributes: {
                address: modalData? modalData?.attributes?.address : undefined,
                compte_bancaire: modalData? modalData?.attributes?.compte_bancaire : undefined,
            }
        },
    })
    const queryClient = useQueryClient()

    const getRoles = async()=>{
        const req = await api.get('/roles')
        return req.data
    }

    const {data: roles, isLoading: roleIsLoding} = useQuery({
        queryKey: ['roles'],
        queryFn: getRoles,
    })

    const updateUser = async (data: z.infer<typeof editUserFormSchema>) =>{
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

    const  onSubmit = async(data: z.infer<typeof editUserFormSchema>) => {
        mutation.mutate(data)
    }
    return(
        <Form {...form}>
            <form action="" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField render={({field}) => (
                    <FormItem className={'input-group'}>
                        <FormLabel>Username <sup>*</sup></FormLabel>
                        <FormControl>
                            <Input {...field} type={'text'} className={'user_input'}
                                   />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} name={'username'} control={form.control}/>

                <FormField render={({field}) => (
                    <FormItem className={'input-group'}>
                        <FormLabel>Rôle <sup>*</sup></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                            <FormControl>
                                <SelectTrigger className={'user_input'}>
                                    {roleIsLoding? <Spinner/> : <SelectValue placeholder="Sélectionnez un rôle"/>}
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {
                                    roles && roles.map((role: { _id: string, name: string }) => {
                                        return (
                                            <SelectItem value={role?._id} key={role?._id}>{role?.name}</SelectItem>
                                        )
                                    })
                                }
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} name={'roles'} control={form.control}/>


                <FormField render={({field}) => (
                    <FormItem className={'input-group'}>
                        <FormLabel>Adresse <sup>*</sup></FormLabel>
                        <FormControl>
                            <Input {...field} type={'text'} className={'user_input'}/>
                        </FormControl>
                    </FormItem>
                )} name={'attributes.address'} control={form.control}/>
                <FormField
                    render={({field}) => (
                        <FormItem className='input-group'>
                            <FormLabel> N° Compte Banquaire <sup>*</sup></FormLabel>
                            <FormControl>
                                <Input {...field} type={'text'} className={'user_input'}/>
                            </FormControl>
                        </FormItem>
                    )}
                    name='attributes.compte_bancaire'
                    control={form.control}
                />

                <div className={'flex gap-2 mt-4'}>
                    <Button onClick={closeModal} type={'button'}>Fermer</Button>
                    {mutation.isPending ? <Spinner/> :
                        <Button type={'submit'} className={'bg-green-500 '}> <Plus/> Mettre à jour </Button>
                    }
                </div>

            </form>
        </Form>
    )
}