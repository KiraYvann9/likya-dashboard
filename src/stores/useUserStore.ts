import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {toast} from "react-hot-toast";
import axios from 'axios';

interface user {
    user: any;
    setUser:(data: Record<any, string>)=>any;
    updateUser : (data: any)=> void;
    clearUser: ()=> void;
}

export const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const useUserStore = create<user>()(persist((set, get)=>({
    user:  null,
    setUser: (data) => set({user: data}),
    updateUser: (data) =>{
        const {user} = get()
        set({...user, ...data})
    },
    clearUser: () => set({user: null})

}), {name: 'user'}))