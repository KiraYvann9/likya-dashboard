import {create} from 'zustand';
import {persist, devtools} from 'zustand/middleware';
import {toast} from "react-hot-toast";
import axios from 'axios';

interface user {
    user: any,
    login:(data: {phonenumber: string, password: string})=>any;
    updateUser : (data: any)=>any;
    logOut: ()=>any;
}

export const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const useUserStore = create<user>()(persist((set, get)=>({
    user:  null,
    login: async (data) => {

        try{
            const request  = await axios.post(`${baseUrl}/login`, data)
            const response = await request.data
            set({user: response})


            return response

        }catch(err: any){
            throw err
        }
    },
    updateUser: (data) =>{
        const {user} = get()
        set({...user, ...data})
    },
    logOut: async() => {
        const {user} = get()

        try{
            const request = await axios.get(`${baseUrl}/logout`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.access_token}`
                }
            })
            set({user: null})
            return request.data
        }catch(err: any){
            toast.error(err?.message)
        }
    }

}), {name: 'user'}))