"use client"

import {Button} from "@/components/ui/button";
import {Key, UserPlus, Users} from "lucide-react";

import {Form, FormField, FormItem, FormLabel, FormControl} from "@/components/ui/form";

import { Permissions, Roles} from "@/components";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-hot-toast";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import { CardComponent } from "@/components/CardComponent";
import api from "@/services/axiosConfig";


const roleSchema = z.object({
    name: z.string().min(3, {message: 'Minimum 3 caractères'}),
    description: z.string().optional()
})

export default function SettingsPage(){
    const queryClient = useQueryClient()

    const form = useForm({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    })



    const createRole = async (data: z.infer<typeof roleSchema>) =>{
        const req = await api.post('/roles', data)
        return req.data
    }

    const mutation = useMutation({
        mutationKey: ['roles'],
        mutationFn: createRole,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['roles']})
            toast.success('Role Ajouté avec succès ! ')
            form.reset()
        },
        onError:(err) =>{ 
            toast.error(err?.message)
        }
    })


    const onRoleSubmit = (data: z.infer<typeof roleSchema>) =>{
        mutation.mutate(data)
        console.log(data)
    }

    return(
        <CardComponent className={'w-full space-y-6 p-6'}>
            <div className={'mb-8'}>
                <h1 className={'text-2xl font-bold text-gray-900'}>Rôles & Permissions</h1>
            </div>

            <div className={'w-full'}>
                <div className={'mb-6'}>
                    <h3 className={'text-lg font-semibold text-gray-800 mb-4'}>Créer un nouveau rôle</h3>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onRoleSubmit)} className={'w-full flex flex-row gap-4 items-end p-6 bg-gray-50 rounded-lg border border-gray-200'}>
                        <FormField render={({field})=>(
                            <FormItem className={'w-1/4'}>
                                <FormLabel className={'font-medium text-gray-700'}>Libélé du rôle</FormLabel>
                                <FormControl>
                                    <Input
                                        className={'border-2 border-gray-300 rounded-lg h-10 focus:border-custom_color-green transition-colors duration-200'}
                                        {...field}
                                        type={'text'}
                                        placeholder={'Entrez le libélé'}
                                    />
                                </FormControl>
                            </FormItem>
                        )} name={'name'} control={form.control}/>
                        <FormField render={({field})=>(
                            <FormItem className={'w-full'}>
                                <FormLabel className={'font-medium text-gray-700'}>Description du rôle</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type={'text'}
                                        className={'w-full border-2 border-gray-300 rounded-lg h-10 focus:border-custom_color-green transition-colors duration-200'}
                                        placeholder={'Description'}
                                    />
                                </FormControl>
                            </FormItem>
                        )} name={'description'} control={form.control}/>

                        <div className={'flex gap-2'}>
                            <Button
                                className="bg-custom_color-green hover:opacity-90 transition-all duration-300 px-6 py-2 text-sm font-semibold rounded-lg text-white"
                            >
                                <Key size={18} className='mr-2'/>
                                Ajouter un rôle
                            </Button>
                        </div>
                    </form>
                </Form>

            </div>

            <div className={'w-full flex gap-6'}>
                <Roles className={'w-1/3'}/>
                <Permissions className={'w-2/3'}/>
            </div>

            
        </CardComponent>
    )
}