'use client'
import {CardFooter, Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchData, updateData} from "@/services/service";
import Spinner from "@/components/spinner";
import {toast} from "react-hot-toast";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {usePermissionStore} from "@/stores/userPermissionStore";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useState} from "react";

export const Permissions = ({className}:{className: string}) =>{

    const [isPermissionChecked, setIsPermissionChecked] = useState<boolean>(false)

    const {roleID,checkedRolePermissions, addPermission, deletePermission} = usePermissionStore()
    const getPermissions = async()=>{
        const req = await fetchData('/permissions')
        return req
    }

    const {data: permissions, isLoading: isPermissionsLoading, isError: isPermissionsError} = useQuery({
        queryKey: ['permissions'],
        queryFn: getPermissions,
    })

    {isPermissionsError && toast.error('Erreur lors du chargement des permissions')}

    const givePermissions = async (data: Array<string>)=>{
        return await updateData(`/roles/${roleID}/assign-permissions`, data)

    }

    const mutation = useMutation({
        mutationFn: givePermissions,
        onSuccess: ()=>{
            toast.success('Permissions mises à jour avec succès !')
        },
        onError: () =>{toast.error('Erreur')}

    })

    const onPermissonSend = () =>{
        mutation.mutate(checkedRolePermissions)
    }

    {mutation.error && toast.error('Veuillez choisir un rôle')}

    return(
        <Card className={className}>
            <CardHeader className={'flex flex-row justify-between'}>
                <div className={'flex flex-col gap-2'}>
                    <CardTitle>Permissions</CardTitle>
                    <CardDescription>Liste des permissions par cartégorie</CardDescription>
                </div>
                { mutation.isPending? <Spinner/>:
                    <Button className={'shadow-md bg-custom_color-green'} onClick={onPermissonSend} disabled={!isPermissionChecked|| !roleID}> <Plus/> Attribuer les permissions</Button>
                }
            </CardHeader>
            <CardContent>

                {
                    isPermissionsLoading ? <Spinner/> :

                        permissions && permissions.map((permission: any, index:number)=>{

                            return(
                                <Accordion key={index} type="single" collapsible={true} className="w-full">
                                    <AccordionItem value={`item-${index+1}`}>
                                        <AccordionTrigger className={'bg-gray-300 px-2 text-black'}>{permission.title?.fr}</AccordionTrigger>
                                        <AccordionContent className={'space-y-2 p-4'}>

                                            {
                                                permission?.permissions?.map((item: any, index: number)=>{
                                                    return(
                                                        <div className="flex items-center space-x-2" key={index}>
                                                            <Switch id="airplane-mode" checked={checkedRolePermissions.includes(item?.code)}
                                                             onCheckedChange={()=> {
                                                                 setIsPermissionChecked(true)
                                                                 !checkedRolePermissions.includes(item?.code) ? addPermission(item?.code):
                                                                     deletePermission(item?.code)

                                                             }}

                                                            /> <Label>{item?.desc?.fr}</Label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )
                        })
                }

            </CardContent>

        </Card>
    )
}