import axios, { AxiosError } from "axios";
import { auth } from "@/lib/config/firebase";

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
            if (typeof window !== 'undefined') {
                const currentUser = auth.currentUser;
                const token = currentUser ? await currentUser.getIdToken() : null;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        } catch (error) {
            console.error('Erreur lors de la récupération du token Firebase:', error);
            return config;
        }
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export default api;