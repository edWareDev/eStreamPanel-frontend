import axios from "axios";
import { timeoutPromise } from "../timeoutPromise";
import { API_BE } from "../fetchToBackEnd";

export const fetchCategories = async () => {
    const onError = 'Error al obtener las categorias';
    try {
        const response = await Promise.race([
            axios.get(
                `${API_BE}/categories`,
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


export const fetchCreateCategory = async (data) => {
    const onError = 'Error al crear la categoria';
    try {
        const response = await Promise.race([
            axios.post(
                `${API_BE}/categories`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_ESTREAMPANEL_API_BEARER}`
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

export const fetchEditCategory = async (id, data) => {
    const onError = 'Error al editar la categoria';
    try {
        const response = await Promise.race([
            axios.put(
                `${API_BE}/categories/id/${id}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_ESTREAMPANEL_API_BEARER}`
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


export const fetchDeleteCategory = async (id) => {
    const onError = `Error al eliminar la categoria`;
    try {
        const response = await Promise.race([
            axios.delete(
                `${API_BE}/categories/id/${id}`,
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