'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import Image from "next/image";
import './login.css'

import {z} from "zod"

import { Form, FormItem, FormField, FormControl, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { Button } from '../ui/button';
import {useUserStore} from "@/stores/useUserStore";
import {useMutation} from "@tanstack/react-query";
import {toast} from "react-hot-toast";

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {Eye, EyeClosed} from "lucide-react";
import { login } from '../../services/auth_actions';

const schema = z.object({
    phonenumber: z.string(),
    password: z.string().min(8),
})


export const LoginForm = () => {


    const [showPWD, setShowPWD] = useState<boolean>(false)
    const router = useRouter()

    const setUser = useUserStore(s => s.setUser)
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            phonenumber: '',
            password: '',
        }
    })

    const mutation = useMutation({
        mutationFn: (data: FormData) => login(data),
        onSuccess: (response: any)=>{

            toast.success(response?.message)
            form.reset()
            setUser(response.user)
            response?.user?.role?.slug !== 'super-administrateur'?router.push('/invoices') : router.push('/settings')

        },
        onError(error: { response:{data: {message_error: string}} }){

            console.log('Error :', error)

            toast.error(error?.response?.data.message_error)

        }
    })

    const submit =(data: z.infer<typeof schema>) =>{

        const formData = new FormData()
        formData.append('phonenumber', data.phonenumber)
        formData.append('password', data.password)
        
        mutation.mutate(formData)
    }

  return (
    <div className='login'>
        <Image src="/assets/logo2.svg" width={200} height={78} alt='logo'/>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
                <FormField 
                    render={({field})=>(
                        <FormItem className='form_group'>
                            <FormLabel className='label'> N° Téléphone <sup>*</sup></FormLabel>
                            <FormControl>
                                <PhoneInput
                                    placeholder="Enter phone number"
                                    {...field} className={'input'} international defaultCountry={'CI'}/>
                            </FormControl>
                        </FormItem>
                    )}
                    name='phonenumber'
                    control={form.control}
                />
                <FormField 
                    render={({field})=>(
                        <FormItem className='form_group'>
                            <FormLabel className='label'> Mot de passe <sup>*</sup> </FormLabel>
                            <FormControl>
                                <div className={'w-full relative'}>
                                    <Input type={showPWD?"text":"password"} {...field} className='input pr-10' placeholder={'*******'}/>
                                    {showPWD?
                                        <Eye className={'absolute top-4 right-2 text-muted-foreground cursor-pointer'} onClick={()=>setShowPWD(!showPWD)}/>
                                        :
                                        <EyeClosed className={'absolute top-4 right-2 text-muted-foreground cursor-pointer'} onClick={()=>setShowPWD(!showPWD)}/>
                                    }
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                    name='password'
                    control={form.control}
                />

                <Button type='submit' className='btn'>Se connecter</Button>
            </form>
        </Form>
    </div>
  )
}
