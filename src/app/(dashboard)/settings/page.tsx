"use client"

import {Button} from "@/components/ui/button";
import {Download, Key, UserPlus, Users} from "lucide-react";

import './style.css'
import {DataTable} from "@/components";
import {columns} from "./_components/table/columns";
import {fetchData} from "@/services/service";
import {useQuery} from "@tanstack/react-query";
import {useUserModal} from "@/stores/useModalStore";
import {UserModal} from "./_components/modal/UserModal/Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {UserSheet} from "@/app/(dashboard)/settings/_components/sheet/UserSheet";


export default function SettingsPage(){
    const openModal = useUserModal(state => state.openModal)

    const getUsers =async ()=>{
        const response = await fetchData('/users')
        return response.items
    }

    const {data: users, isLoading, isError} = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    })

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

                    <DataTable columns={columns} data={users || []} isLoading={isLoading}/>
                    <UserSheet/>
                </TabsContent>
                <TabsContent value="password" className="w-full p-4">
                    <div className={'settings_header'}>
                        {/* <h1>Settings</h1> */}
                        <div className={'btn_container'}>
                            <Button className="bg-custom_color-green"><Key/> Ajouter un role</Button>
                            <Separator orientation="vertical"/>
                            <Button variant={'ghost'} title="Télécharger PDF"><Download/></Button>
                        </div>
                    </div>
                    
                    <h3>Liste des rôles et permissions</h3>
                </TabsContent>
            </Tabs>

            
        </div>
    )
}