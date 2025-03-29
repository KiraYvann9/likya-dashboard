"use server"
import { cookies } from "next/headers";


export const getCookies = async() =>{
    return (await cookies()).get("access_token")?.value || null
}
