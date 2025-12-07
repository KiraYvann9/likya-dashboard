import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/spinner";
import { toast } from "react-hot-toast";
import { usePermissionStore } from "@/stores/userPermissionStore";
import api from "@/services/axiosConfig";
import { CardComponent } from "../CardComponent";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

const extractPermissionCodes = (tableau: Array<any>) => {
    return tableau
        .flatMap(item => item.permissions || [])
        .map(permission => permission.code)
}

export const Roles = ({ className }: { className: string }) => {
    const checkRole = usePermissionStore(s => s.checkRole)
    const queryClient = useQueryClient()

    const getRoles = async () => {
        const req = await api.get('/roles')
        return req.data?.items
    }

    const { data: roles, isLoading: roleIsLoading, isError } = useQuery({
        queryKey: ['roles'],
        queryFn: getRoles,
    })

    const mutation = useMutation({
        mutationKey: ['roles'],
        mutationFn: async (roleID: string) => {
            const req = await api.delete(`/roles/${roleID}`)
            return req.data
        },
        onSuccess: () => {
            toast.success('Rôle supprimé avec succès')
            queryClient.invalidateQueries({ queryKey: ['roles'] })
        }
    })

    { isError && toast.error('Erreur lors de la connexion au serveur') }
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Rôles</CardTitle>
                <CardDescription>Créez des rôles et attribuez les des permission</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup defaultValue="comfortable" onValueChange={

                    (value: any) => {
                        checkRole(value._id)
                    }}>

                    {
                        roleIsLoading ? <Spinner /> :

                            roles.map((role: any) => {
                                return (

                                    <div key={role._id} className="flex items-center justify-between border rounded-md p-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={role} id={role?._id} />
                                            <Label htmlFor={role?._id} className="text-xl text-gray-800">{role?.name}</Label>
                                        </div>
                                        <div>
                                            <Button variant="outline" size="sm" onClick={() => {
                                                mutation.mutate(role._id)
                                            }} disabled={mutation.isPending}>
                                                {mutation.isPending ? <Spinner/> : <Trash size={16} />}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })

                    }
                    {!roles && 'Aucun role n\'a été créé'}
                </RadioGroup>
            </CardContent>

        </Card>
    )
}