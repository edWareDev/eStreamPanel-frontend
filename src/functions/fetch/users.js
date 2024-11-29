import axios from "axios";
import { timeoutPromise } from "../timeoutPromise";
import { API_BE } from "../fetchToBackEnd";

export const fetchUsers = async () => {
    const onError = 'Error al obtener los usuarios';
    try {
        const response = await Promise.race([
            axios.get(
                `${API_BE}/subscribers`,
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

export const fetchCreateUser = async (data) => {
    const onError = 'Error al crear el usuario';
    try {
        const response = await Promise.race([
            axios.post(
                `${API_BE}/subscribers`,
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

export const fetchEditUser = async (id, data) => {
    const onError = 'Error al editar el usuario';
    try {
        const response = await Promise.race([
            axios.put(
                `${API_BE}/subscribers/id/${id}`,
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

export const fetchDeleteUser = async (id) => {
    const onError = `Error al eliminar el usuario`;
    try {
        const response = await Promise.race([
            axios.delete(
                `${API_BE}/subscribers/id/${id}`,
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