"use server";

import { cookies } from "next/headers";
import axios from "axios";

import { getCookies } from "@/services/cookies";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { auth } from '@/lib/config/firebase';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;


type credentials = {
  email: string;
  password: string;
};

export const login = async (data: credentials) => {

  try {

    const { user } = await signInWithEmailAndPassword(auth, data.email, data.password)

    if (user) {
      const idToken = await user.getIdToken();
      (await cookies()).set("access_token", idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return {
        success: true,
        message: "Connecté avec succès !",
        user: user,
      };
    }

    // if (res.user.refreshToken) {
    //   (await cookies()).set("refresh_token", res.data.token.refresh_token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "strict",
    //     path: "/",
    //     maxAge: 60 * 60 * 24 * 30,
    //   });
    // }

    return { success: false, message: "Authentificaton échoué" };
  } catch (error: unknown) {
    console.warn(error);
  }
};

export const logout = async () => {

  try {

    await auth.signOut();

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