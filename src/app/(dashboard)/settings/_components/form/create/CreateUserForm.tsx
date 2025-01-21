import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {createUserFormSchema} from './createUserFormSchema'
import React, {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {z} from "zod";
import {fetchData, postData} from "@/services/service";
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
import PhoneInput from 'react-phone-number-input'
import {Button} from "@/components/ui/button";
import {Eye, EyeClosed, Plus} from "lucide-react";
import {useUserModal} from "@/stores/useModalStore";
import Spinner from "@/components/spinner";

export const CreateUserForm = () =>{

    const closeModal  = useUserModal(state => state.closeModal)
    const [showPWD, setShowPWD] = useState<boolean>(false)

    const form = useForm({
        resolver: zodResolver(createUserFormSchema),
        defaultValues: {
            fullname: '',
            phonenumber: '',
            email: '',
            password: '',
            role: '',
            attributes: {
                address: '',
                compte_bancaire: '',
            }
        },
    })
    const queryClient = useQueryClient()

    const getRoles = async()=>{
        const req = await fetchData('/roles')
        return req.items
    }

    const {data: roles, isLoading: roleIsLoading} = useQuery({
        queryKey: ['roles'],
        queryFn: getRoles,
    })

    const createUser = async (data: z.infer<typeof createUserFormSchema>) =>{
        const req = await postData('/users', data)
        return req.data
    }

    const mutation = useMutation({
        mutationKey: ['register'],
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['users']})
            toast('Ajouter avec succès ')
            form.reset()
            closeModal()
        },
        onError:(err) =>{ console.log('User Error :', err);
            toast(err?.message)
        }
    })
    const  onSubmit = async(data: any) => {
        mutation.mutate(data)
    }
    return(
        <Form {...form}>
            <form action="" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField render={({field})=>(
                    <FormItem className={'input-group'}>
                        <FormLabel>Nom et prénoms <sup>*</sup></FormLabel>
                        <FormControl>
                            <Input {...field} type={'text'} className={'user_input'}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} name={'fullname'} control={form.control}/>
                <FormField
                    render={({field})=>(
                        <FormItem className='input-group'>
                            <FormLabel > N° Téléphone <sup>*</sup></FormLabel>
                            <FormControl>
                                <PhoneInput
                                    placeholder="Enter phone number"
                                    {...field} className={'user_input'} international defaultCountry={'CI'}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    name='phonenumber'
                    control={form.control}
                />

                <FormField render={({field})=>(
                    <FormItem className={'input-group'}>
                        <FormLabel>Rôle <sup>*</sup></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className={'user_input'}>
                                    { roleIsLoading? <Spinner/> : <SelectValue placeholder="Sélectionnez un rôle" />}
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {
                                    roles && roles.map((role: any)=>{
                                        return(
                                            <SelectItem value={role?._id} key={role?._id}>{role?.name}</SelectItem>
                                        )
                                    })
                                }
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} name={'role'} control={form.control}/>

                <FormField render={({field})=>(
                    <FormItem className={'input-group'}>
                        <FormLabel>E-mail <sup>*</sup></FormLabel>
                        <FormControl>
                            <Input {...field} type={'email'} className={'user_input'}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} name={'email'} control={form.control}/>
                <FormField
                    render={({field})=>(
                        <FormItem className='input-group'>
                            <FormLabel > Mot de passe <sup>*</sup></FormLabel>
                            <FormControl>
                                <div className={'w-full relative'}>
                                    <Input type={showPWD ? "text" : "password"} {...field} className='user_input pr-10'
                                           placeholder={'*******'}/>
                                    {showPWD ?
                                        <Eye size={18} className={'absolute top-3 right-2 text-muted-foreground cursor-pointer'}
                                             onClick={() => setShowPWD(!showPWD)}/>
                                        :
                                        <EyeClosed size={18}
                                            className={'absolute top-3 right-2 text-muted-foreground cursor-pointer'}
                                            onClick={() => setShowPWD(!showPWD)}/>
                                    }
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    name='password'
                    control={form.control}
                />


                <FormField render={({field}) => (
                    <FormItem className={'input-group'}>
                        <FormLabel>Adresse <sup>*</sup></FormLabel>
                        <FormControl>
                            <Input {...field} type={'text'} className={'user_input'}/>
                        </FormControl>
                    </FormItem>
                )} name={'attributes.address'} control={form.control}/>
                <FormField
                    render={({field})=>(
                        <FormItem className='input-group'>
                            <FormLabel > N° Compte Banquaire <sup>*</sup></FormLabel>
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
                    <Button type={'submit'} className={'bg-green-500'}> <Plus/> Créer </Button>
                </div>

            </form>
        </Form>
    )
}