
import axios from "axios";
import {useUserStore} from "@/stores/useUserStore";
import { getCookies } from "./cookies";
import api from "./axiosConfig";


const baseUrl = process.env.NEXT_PUBLIC_API_URL

if(!baseUrl){
    throw new Error("No base url provided");
}


export const getUserInfo = async(id: string) =>{
    return await api.get(`/users/${id}`)
}

export const getUserProfile = async() =>{
    return await api.get(`/profiles/me`)
}