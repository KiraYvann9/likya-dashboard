"use server";

import { cookies } from "next/headers";


export const logout = async () => {
  try {
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