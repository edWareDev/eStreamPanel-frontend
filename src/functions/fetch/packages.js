import axios from "axios";
import { timeoutPromise } from "../timeoutPromise";
import { API_BE } from "../fetchToBackEnd";


export const fetchPackages = async () => {
    const onError = 'Error al obtener los paquetes';
    try {
        const response = await Promise.race([
            axios.get(
                `${API_BE}/packages`,
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

export const fetchCreatePackage = async (data) => {
    const onError = 'Error al crear el paquete';
    try {
        const response = await Promise.race([
            axios.post(
                `${API_BE}/packages`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',  // Asegúrate de establecer el tipo de contenido correcto
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

export const fetchEditPackage = async (id, data) => {
    const onError = 'Error al editar el paquete';
    try {
        const response = await Promise.race([
            axios.put(
                `${API_BE}/packages/id/${id}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',  // Asegúrate de establecer el tipo de contenido correcto
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

export const fetchDeletePackage = async (id) => {
    const onError = `Error al eliminar el paquete`;
    try {
        const response = await Promise.race([
            axios.delete(
                `${API_BE}/packages/id/${id}`,
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