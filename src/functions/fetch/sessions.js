import axios from "axios";
import { API_BE } from "../fetchToBackEnd";
import { timeoutPromise } from "../timeoutPromise";

export const fetchSessions = async () => {
    const onError = 'Error al obtener las sesiones';
    try {
        const response = await Promise.race([
            axios.get(
                `${API_BE}/sessions`,
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

export const fetchKillConnection = async (id) => {
    const onError = `Error al cerrar la conexión local`;
    try {
        const response = await Promise.race([
            axios.delete(
                `${API_BE}/sessions/id/${id}`,
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
};