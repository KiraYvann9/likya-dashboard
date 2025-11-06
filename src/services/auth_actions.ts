"use server";

import { cookies } from "next/headers";
import axios from "axios";

import { getCookies } from "@/services/cookies";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;


type credentials = {
  username: string | null;
  password: string | null;
};

export const login = async (data: credentials) => {
  
  console.log("API URL:", baseUrl);

  try {

    const res = await axios.post(`${baseUrl}/token`, data);

    if (res.data?.token?.access_token) {
      (await cookies()).set("access_token", res.data.token.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return {
        success: true,
        message: "Connecté avec succès !",
        user: res.data.user,
      };
    }

    if (res.data?.token?.refresh_token) {
      (await cookies()).set("refresh_token", res.data.token.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return { success: false, message: "Authentificaton échoué" };
  } catch (error: unknown) {
    console.warn(error);
  }
};

export const logout = async () => {
    const token = await getCookies();
    try{
        const request = await axios.get(`${baseUrl}/logout`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        
        return request.data
    }catch(err: unknown){
        throw err
    }
};