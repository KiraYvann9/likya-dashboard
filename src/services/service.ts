
import axios from "axios";
import {useUserStore} from "@/stores/useUserStore";
import { getCookies } from "./cookies";


const baseUrl = process.env.NEXT_PUBLIC_API_URL

if(!baseUrl){
    throw new Error("No base url provided");
}


export const fetchData = async(endpoint: string) =>{
    const token = await getCookies()
    if(!token){
        console.warn("🔴 Aucun token d'authentification trouvé.");
        //throw new Error('User is not authenticated');
    }
    try {
        const req = await axios.get(`${baseUrl}${endpoint}`, {
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return req.data
    }catch(err: any){

        console.error("❌ Erreur lors du fetch :", err)

        return{
            success: false,
            message: err.response?.data?.error?.message || "Une erreur est survenue"
        }
        //throw err

    }
}


export const postData = async(endpoint: string, data: any) =>{
    const token = await getCookies()
    try {
        const req = await axios.post(`${baseUrl}${endpoint}`, data, {
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return req.data
    }catch(err){
        throw err
    }
}

export const updateData = async(endpoint: string, data: any) =>{
    const token = await getCookies()
    try {
        const req = await axios.patch(`${baseUrl}${endpoint}`, data, {
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return req.data
    }catch(err){
        throw err
    }
}
export const deleData = async(endpoint: string) =>{
    const token = await getCookies()
    try {
        const req = await axios.delete(`${baseUrl}${endpoint}`, {
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return req.data
    }catch(err){
        throw err

    }
}


export const changeStatus = async(endpoint: string) =>{
    const token = await getCookies()
    try {
        const req = await axios.put(`${baseUrl}${endpoint}`, {}, {
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return req.data
    }catch(err){
        console.log('Fecth error', err);

    }
}