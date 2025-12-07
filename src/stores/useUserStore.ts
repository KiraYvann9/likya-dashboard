import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface user {
    user: any;
    profile: any;
    setProfile: (data: Record<any, any>) => void;
    updateProfile: (data: any) => void;
    setUser:(data: Record<any, any>)=>any;
    updateUser : (data: any)=> void;
    clearUser: ()=> void;
}


export const useUserStore = create<user>()(persist((set, get)=>({
    user:  null,
    profile: null,
    setProfile: (data) => set({profile: data}),
    updateProfile: (data) =>{
        const {profile} = get()
        set({profile: {...profile, ...data}})
    },
    setUser: (data) => set({user: data}),
    updateUser: (data) =>{
        const {user} = get()
        set({user: {...user, ...data}})
    },
    clearUser: () => set({user: null, profile: null})

}), {name: 'user'}))