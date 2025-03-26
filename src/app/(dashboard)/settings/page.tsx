"use client"

import {Button} from "@/components/ui/button";
import {Download, Key, UserPlus, Users} from "lucide-react";

import {Form, FormField, FormItem, FormLabel, FormControl} from "@/components/ui/form";

import './style.css'
import {DataTable, Permissions, Roles} from "@/components";
import {columns} from "./_components/table/columns";
import {fetchData, postData} from "@/services/service";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useUserModal} from "@/stores/useModalStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {UserSheet} from "@/app/(dashboard)/settings/_components/sheet/UserSheet";
import {toast} from "react-hot-toast";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";

const roleSchema = z.object({
    name: z.string().min(3, {message: 'Minimum 3 caractères'}),
    description: z.string().optional()
})

export default function SettingsPage(){
    const queryClient = useQueryClient()
    const openModal = useUserModal(state => state.openModal)

    const getUsers =async ()=>{
        const response = await fetchData('/users')
        return response.items
    }

    const form = useForm({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    })

    const {data: users, isLoading, isError} = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5
    })

    const createRole = async (data: z.infer<typeof roleSchema>) =>{
        const req = await postData('/roles', data)
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
        onError:(err) =>{ console.log('Role Error :', err);
            toast.error(err?.message)
        }
    })


    const onRoleSubmit = (data: z.infer<typeof roleSchema>) =>{
        mutation.mutate(data)
        console.log(data)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    { isError && toast.error('Quelque chose s\'est mal passée')}
    return(
        <div className={'settings'}>
            <h1>Settings</h1>

            <Tabs defaultValue="account" className="w-full">
                <TabsList >
                    <TabsTrigger value="account" className="text-sm"><Users size={18}/> <span>Utilisateurs</span> </TabsTrigger>
                    <TabsTrigger value="password"><Key size={18}/> <span>Rôles & Permissions</span></TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="w-full p-4">
                    <div className={'settings_header'}>
                        <div className={'btn_container'}>
                            <Button className="bg-custom_color-green" onClick={()=>openModal('CREATE')}><UserPlus/> Créer un utilisateur</Button>
                            <Separator orientation="vertical"/>
                            <Button variant={'ghost'} title="Télécharger PDF"><Download/></Button>
                        </div>
                    </div>
                    <h3>Liste des utilisateurs</h3>

                    <DataTable
                        filterBy={"phonenumber"}
                        filterPlaceholder={'Filtre par N° Téléphone'}
                        columns={columns} data={users || []}
                        isLoading={isLoading}
                    />
                    <UserSheet/>
                </TabsContent>
                <TabsContent value="password" className="w-full p-4 space-y-8">

                    <div className={'w-full '}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onRoleSubmit)} className={'w-full flex flex-row gap-2 items-end'}>
                                <FormField render={({field})=>(
                                    <FormItem className={'w-1/4'}>
                                        <FormLabel>Libélé du rôle</FormLabel>
                                        <FormControl>
                                            <Input className={'border-custom_color-green '} {...field} type={'text'} placeholder={'Entrez le libélé'}/>
                                        </FormControl>
                                    </FormItem>
                                )} name={'name'} control={form.control}/>
                                <FormField render={({field})=>(
                                    <FormItem className={'w-full'}>
                                        <FormLabel>Description du rôle</FormLabel>
                                        <FormControl>
                                            <Input {...field} type={'text'} className={'w-full border-custom_color-green'} placeholder={'Description'}/>
                                        </FormControl>
                                    </FormItem>
                                )} name={'name'} control={form.control}/>

                                <div className={'flex'}>
                                    <Button className="bg-custom_color-green"><Key/> Ajouter un role</Button>
                                    <Separator orientation="vertical"/>
                                    <Button variant={'ghost'} title="Télécharger PDF"><Download/></Button>
                                </div>
                            </form>
                        </Form>

                    </div>
                    
                    <div className={'w-full flex gap-2'}>
                        <Roles className={'w-1/3'}/>
                        <Permissions className={'w-2/3'}/>
                    </div>
                </TabsContent>
            </Tabs>

            
        </div>
    )
}