import axios from "axios";
import { timeoutPromise } from "./timeoutPromise";

export const API_BE = import.meta.env.VITE_API_BE
export const API_FS = import.meta.env.VITE_API_FS
export const AUTH_BE = import.meta.env.VITE_AUTH_BE

const SERVER_FLUSSONIC_BEARER = import.meta.env.VITE_SERVER_FLUSSONIC_BEARER

export const fetchAdminViewToken = async () => {
    const onError = 'Error al obtener el token';
    try {
        const response = await Promise.race([
            axios.post(
                `${API_FS}/streamer/api/v3/admin_view_token`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${SERVER_FLUSSONIC_BEARER}`
                    }
                }
            ),
            timeoutPromise(onError)
        ]);

        // Verificar si la respuesta no es exitosa
        if (response.status !== 200) {
            throw new Error(`${onError}: ${response.status}`);
        }

        // Si todo está bien, retornar los datos
        return response.data;
    } catch (error) {
        console.error(onError, error);
        return { error: onError };
    }
}

export const fetchServerStats = async () => {
    const onError = 'Error al obtener los stats';
    try {
        const response = await Promise.race([
            axios.get(
                `${API_BE}/system/stats`,
                {
                    headers: {
                        'Authorization': `Bearer ${import.meta.env.VITE_ESTREAMPANEL_API_BEARER}`  // Aquí es donde añades el token bearer
                    }
                }
            ),
            timeoutPromise(onError)
        ]);

        // Verificar si la respuesta no es exitosa
        if (response.status !== 200) {
            throw new Error(`${onError}: ${response.status}`);
        }

        // Si todo está bien, retornar los datos
        return response.data;
    } catch (error) {
        console.error(onError, error);
        return { error: onError };
    }
}