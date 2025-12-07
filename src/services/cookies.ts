"use server"
import { cookies } from "next/headers";

export const getCookies = async() =>{
    try {
        const cookieStore = await cookies();
        return cookieStore.get("access_token")?.value || null;
    } catch (error) {
        console.error("Error getting cookie:", error);
        return null;
    }
}

export const deleteCookies = async(name: string = "access_token") =>{
    try {
        const cookieStore = await cookies();
        cookieStore.delete(name);
        return { success: true, message: `Cookie ${name} deleted successfully` };
    } catch (error) {
        console.error(`Error deleting cookie ${name}:`, error);
        throw new Error(`Failed to delete cookie: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
