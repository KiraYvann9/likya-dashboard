import axios, { AxiosError } from "axios";
import supabase from "../lib/config/supabase";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    async (config) => {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Erreur lors de la récupération de la session Supabase:', error);
                return config;
            }
            const token = data?.session?.access_token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            console.error('Erreur lors de la récupération du token Supabase:', error);
            return config;
        }
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export default api;