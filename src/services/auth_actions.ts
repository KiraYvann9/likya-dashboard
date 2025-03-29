"use server";

import { cookies } from "next/headers";
import axios from "axios";

import { getCookies } from "@/services/cookies";

const baseUrl = process.env.API_URL;

export const login = async (data: FormData) => {
  const phonenumber = data.get("phonenumber");
  const password = data.get("password");

  try {

    const res = await axios.post(`${baseUrl}/login`, { phonenumber, password });

    if (res.data?.access_token) {
      (await cookies()).set("access_token", res.data.access_token, {
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

    if (res.data?.refresh_token) {
      (await cookies()).set("refresh_token", res.data.refresh_token, {
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