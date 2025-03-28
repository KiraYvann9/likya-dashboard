import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {Label} from "@/components/ui/label";
import {fetchData} from "@/services/service";
import {useQuery} from "@tanstack/react-query";
import Spinner from "@/components/spinner";
import {toast} from "react-hot-toast";
import {usePermissionStore} from "@/stores/userPermissionStore";

const extractPermissionCodes = (tableau: Array<any>) =>{
    return tableau
        .flatMap(item => item.permissions || [])
        .map(permission => permission.code)
}

export const Roles = ({className}:{className: string}) =>{
    const checkRole = usePermissionStore(s => s.checkRole)

    const getRoles = async()=>{
        const req = await fetchData('/roles')
        return req.items
    }

    const {data: roles, isLoading: roleIsLoading, isError} = useQuery({
        queryKey: ['roles'],
        queryFn: getRoles,
    })

    { isError && toast.error('Erreur lors de la connexion au serveur')}
    return(
        <Card className={className}>
            <CardHeader>
                <CardTitle>Rôles</CardTitle>
                <CardDescription>Créez des rôles et attribuez les des permission</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup defaultValue="comfortable" onValueChange={
                    
                    (value: any)=> {
                    value.permissions.length >= 1 ? checkRole(value._id, extractPermissionCodes(value.permissions)):
                        checkRole(value._id, [])
                }}>

                    {
                        roleIsLoading? <Spinner/> :
                            
                            roles.map((role: any)=>{
                                return(

                                    <div key={role._id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={role} id={role?._id} />
                                        <Label htmlFor={role?._id}>{role?.name}</Label>
                                    </div>
                                )
                            })

                    }
                    { !roles && 'Aucun role n\'a été créé'}
                </RadioGroup>
            </CardContent>

        </Card>
    )
}