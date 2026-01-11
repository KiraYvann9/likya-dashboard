"use server";

import { cookies } from "next/headers";
import axios from "axios";

import { getCookies } from "@/services/cookies";
import { supabase } from "@/lib/config/supabase";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;


type credentials = {
  email: string;
  password: string;
};

export const login = async (data: credentials) => {
  try {
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    const session = signInData.session;
    const user = signInData.user;

    if (session && user) {
      const accessToken = session.access_token;
      (await cookies()).set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return {
        success: true,
        message: "Connecté avec succès !",
        user,
      };
    }

    return { success: false, message: "Authentificaton échoué" };
  } catch (error: unknown) {
    console.warn(error);
    return { success: false, message: "Erreur lors de la connexion" };
  }
};

export const logout = async () => {
  try {
    // In server context, just clean cookies. Client can call supabase.auth.signOut().
    (await cookies()).delete("access_token");
    (await cookies()).delete("refresh_token");

    return {
      success: true,
      message: "Déconnexion réussie"
    };
  } catch (error: any) {
    try {
      (await cookies()).delete("access_token");
      (await cookies()).delete("refresh_token");
    } catch (cookieError) {
      console.error("Erreur lors de la suppression des cookies:", cookieError);
    }

    return {
      success: false,
      message: error.response?.data?.message || "Erreur lors de la déconnexion",
      error: error.response?.data || error.message
    };
  }
};