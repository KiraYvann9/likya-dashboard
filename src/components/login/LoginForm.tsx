'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import Image from "next/image";
import dynamic from 'next/dynamic';
// import './login.css'

import {z} from "zod"

import {Form, FormItem, FormField, FormControl, FormLabel} from '../ui/form';
import {Input} from '../ui/input';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '../ui/button';
import {useUserStore} from "@/stores/useUserStore";
import {useMutation} from "@tanstack/react-query";
import {toast} from "react-hot-toast";

import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from '@/lib/config/firebase';

import 'react-phone-number-input/style.css'
// import PhoneInput from 'react-phone-number-input'

import {Eye, EyeClosed} from "lucide-react";
import {getUserInfo} from '@/services/service';


const PhoneInput = dynamic(() => import('react-phone-number-input'), {ssr: false});

const schema = z.object({
    email: z.string({message: 'ce champ est requis'}).min(3, {message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères'}),
    password: z.string().min(8),
})


export const LoginForm = () => {

    const [loginWithUsername, setLoginWithUsername] = useState<boolean>(true)

    const [showPWD, setShowPWD] = useState<boolean>(false)
    const router = useRouter()

    const {setUser, user} = useUserStore()
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const mutation = useMutation({
        mutationFn: async (data: z.infer<typeof schema>) => {
            return await signInWithEmailAndPassword(auth, data.email, data.password);
        },
        onSuccess: async ({user}) => {
            try {
                const userInfo = await getUserInfo(user.uid);

                setUser(userInfo.data);

                // Set lightweight cookies for proxy checks
                try {
                    const isSuper = userInfo.data?.is_superuser ? '1' : '0';
                    document.cookie = `authenticated=1; path=/; max-age=${60 * 60 * 24 * 7}`; // 1 week
                    document.cookie = `is_superuser=${isSuper}; path=/; max-age=${60 * 60 * 24 * 7}`;
                } catch (e) {
                    console.warn('Unable to set auth cookies', e);
                }

                toast.success("Connecté avec succès !");

                form.reset();

                const userRole = userInfo.data?.is_superuser;
                if (userRole) {
                    router.push('/adminwallet');
                } else {
                    router.push('/invoices');
                }
            } catch (error: any) {
                console.error('Error during login process:', error);
                toast.error(error?.response?.data?.message || 'Erreur lors de la récupération des informations utilisateur');
            }
        },


        onError(error: any) {
            const errorMessage = error?.code === 'auth/user-not-found'
                ? 'Utilisateur non trouvé'
                : error?.code === 'auth/wrong-password'
                    ? 'Mot de passe incorrect'
                    : error?.message || 'Erreur de connexion';

            toast.error(errorMessage);
        }
    })

    const submit = (data: z.infer<typeof schema>) => {
        mutation.mutate(data)
    }


    // const {data} = useQuery({
    //     queryKey: ['user-info'],
    //     queryFn: async(userId: string) => {
    //         return await getUserInfo(userId)
    //     }
    // });

    return (

        <div className='bg-gradient-to-br from-white to-gray-50 shadow-lg
    rounded-2xl p-8 border border-gray-100
    transition-all duration-300 hover:shadow-xl w-[450px]'>
            <div className="flex flex-col items-center">
                <Image src="/assets/logo2.svg" width={190} height={68} alt='logo' className="mb-2"/>
                <p className="text-gray-600 text-sm text-center mt-2 mb-6">Bienvenue ! Connectez-vous à votre compte</p>
            </div>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(submit)}
                      className="space-y-6 w-full flex flex-col items-center justify-center gap-6">

                    {
                        loginWithUsername ?
                            <FormField
                                render={({field}) => (
                                    <FormItem className='w-full space-y-1'>
                                        <FormLabel
                                            className='text-muted-foreground text-sm font-medium tracking-wide mb-1'> Username <sup>*</sup>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type={'text'} {...field} className='h-12 text-base border-2 rounded-lg bg-gray-50/50 px-4
    hover:border-blue-400 focus:border-blue-600 focus:bg-white pr-10 transition-all duration-200' placeholder={''}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                                name='email'
                                control={form.control}
                            />
                            :
                            <FormField
                                render={({field}) => (
                                    <FormItem className='w-full space-y-1'>
                                        <FormLabel
                                            className='text-muted-foreground text-sm font-medium tracking-wide mb-1'> N°
                                            Téléphone <sup>*</sup></FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                autoComplete='none'
                                                placeholder="Enter phone number"
                                                {...field}
                                                className={'h-12 text-base border-2 rounded-lg bg-gray-50/50 px-4 hover:border-blue-400 focus:border-blue-600 focus:bg-white'}
                                                international defaultCountry={'CI'}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                                name='email'
                                control={form.control}
                            />
                    }

                    <FormField
                        render={({field}) => (
                            <FormItem className='w-full space-y-1'>
                                <FormLabel className='text-muted-foreground text-sm font-medium tracking-wide mb-1'> Mot
                                    de passe <sup>*</sup> </FormLabel>
                                <FormControl>
                                    <div className={'w-full relative'}>
                                        <Input type={showPWD ? "text" : "password"} {...field} className='h-12 text-base border-2 rounded-lg bg-gray-50/50 px-4
    hover:border-blue-400 focus:border-blue-600 focus:bg-white pr-10 transition-all duration-200'
                                               placeholder={'*******'}/>
                                        {showPWD ?
                                            <Eye
                                                className={'absolute top-4 right-2 text-muted-foreground cursor-pointer'}
                                                onClick={() => setShowPWD(!showPWD)}/>
                                            :
                                            <EyeClosed
                                                className={'absolute top-4 right-2 text-muted-foreground cursor-pointer'}
                                                onClick={() => setShowPWD(!showPWD)}/>
                                        }
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                        name='password'
                        control={form.control}
                    />

                    <Button
                        type='submit'
                        className='w-full h-12 text-white text-base font-semibold rounded-lg
    transition-all duration-200 hover:opacity-90 active:scale-[0.98]
    disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-custom_color-green '
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Connexion en cours...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                                          clipRule="evenodd"/>
                                </svg>
                                <span>Se connecter</span>
                            </>
                        )}
                    </Button>

                    <Button
                        type='button'
                        variant='link'
                        className='p-0 text-sm text-custom_color-green hover:text-emerald-700 transition-colors duration-200'
                        onClick={() => {
                            form.reset()
                            setLoginWithUsername(!loginWithUsername)
                        }}
                    >
                        {loginWithUsername ?
                            "Se connecter avec le numéro de téléphone" :
                            "Se connecter avec le nom d'utilisateur"
                        }
                    </Button>
                </form>
            </Form>
        </div>
    )
}
