'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import Spinner from "@/components/spinner";
import { toast } from "react-hot-toast";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePermissionStore } from "@/stores/userPermissionStore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/services/axiosConfig";

export const Permissions = ({ className }: { className: string }) => {

    const [isPermissionChecked, setIsPermissionChecked] = useState<boolean>(false)

    const { roleID, checkedRolePermissions, addPermission, setCheckedRolePermissions, deletePermission } = usePermissionStore()


    const getRolePermissions = async () => {
        const req = await api.get(`/roles/${roleID}/permissions`)
        return req.data?.items
    }

    const { data: rolePermissions } = useQuery({
        queryKey: ['role-permissions', roleID],
        queryFn: async () => await getRolePermissions(),
        enabled: !!roleID
    })

    const extractPermissionCodes = () => {
        return (rolePermissions ?? [])
            .flatMap((item: { permissions: any; }) => item.permissions || [])
            .map((permission: { code: any; }) => permission.code)
    }

    // if (!rolePermissionsIsLoading && !rolePermissionsIsLoading) {
    //     setCurrentRolePermissions(extractPermissionCodes())
    // }

    useEffect(() => {
        if (rolePermissions) {
            const code = extractPermissionCodes()
            setCheckedRolePermissions(code)
        }
    }, [rolePermissions])

    const getPermissions = async () => {
        const req = await api.get('/permissions')
        return req.data?.items
    }

    const { data: permissions, isLoading: isPermissionsLoading, isError: isPermissionsError } = useQuery({
        queryKey: ['permissions'],
        queryFn: getPermissions,
    })


    { isPermissionsError && toast.error('Erreur lors du chargement des permissions') }

    const givePermissions = async (data: { permissions: Array<string> }) => {

        return await api.put(`/roles/${roleID}/assign-permissions`, data)

    }

    const mutation = useMutation({
        mutationFn: givePermissions,
        onSuccess: () => {
            toast.success('Permissions mises à jour avec succès !')
        },
        onError: () => { toast.error('Erreur') }

    })

    const onPermissonSend = () => {
        const permisions = {
            'permissions': checkedRolePermissions
        }
        mutation.mutate(permisions)
    }


    { mutation.error && toast.error('Veuillez choisir un rôle') }

    return (
        <Card className={className}>
            <CardHeader className={'flex flex-row justify-between items-start gap-6'}>
                <div className={'flex flex-col gap-3'}>
                    <CardTitle className={'text-2xl font-bold'}>Permissions</CardTitle>
                    <CardDescription className={'text-gray-600'}>Gérez les permissions par catégorie</CardDescription>
                </div>
                {mutation.isPending ? <Spinner /> :
                    <Button
                        className={'shadow-lg bg-custom_color-green hover:opacity-90 transition-all duration-300 rounded-lg px-6 py-6 text-base font-semibold text-white'}
                        onClick={onPermissonSend}
                        disabled={!isPermissionChecked || !roleID}
                    >
                        <Plus className='mr-2 h-5 w-5' />
                        Attribuer les permissions
                    </Button>
                }
            </CardHeader>
            <CardContent className={'space-y-2'}>

                {
                    isPermissionsLoading ? <Spinner /> :

                        permissions && permissions.map((permission: any, index: number) => {

                            return (
                                <Accordion key={index} type="single" collapsible={true} className="w-full">
                                    <AccordionItem value={`item-${index + 1}`} className={'border-2 border-gray-200 rounded-lg overflow-hidden hover:border-custom_color-green transition-colors duration-200'}>
                                        <AccordionTrigger className={'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 px-6 py-4 text-gray-800 transition-colors duration-200'}>
                                            <span className={'text-xl'}>{permission.title?.fr}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className={'space-y-2 p-4 bg-white'}>

                                            {

                                                permission?.permissions?.map((item: any, index: number) => {
                                                    return (
                                                        <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-emerald-50 transition-colors duration-200 cursor-pointer group" key={index}>
                                                            <Switch
                                                                id={`permission-${item?.code}`}
                                                                checked={checkedRolePermissions.includes(item?.code)}
                                                                onCheckedChange={(value) => {
                                                                    setIsPermissionChecked(true)
                                                                    !checkedRolePermissions.includes(item?.code) ? addPermission(item?.code) :
                                                                        deletePermission(item?.code)

                                                                }}
                                                                className={'transition-all duration-200 data-[state=checked]:bg-green-500'}
                                                            />
                                                            <Label
                                                                htmlFor={`permission-${item?.code}`}
                                                                className={'text-gray-700 font-medium cursor-pointer flex-1 group-hover:text-custom_color-green transition-colors duration-200'}
                                                            >
                                                                {item?.desc?.fr}
                                                            </Label>
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