import axios from "axios";
import { timeoutPromise } from "../timeoutPromise";
import { API_BE } from "../fetchToBackEnd";


export const fetchPlans = async () => {
    const onError = 'Error al obtener los planes';
    try {
        const response = await Promise.race([
            axios.get(
                `${API_BE}/plans`,
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


export const fetchCreatePlan = async (data) => {
    const onError = 'Error al crear el plan';
    try {
        const response = await Promise.race([
            axios.post(
                `${API_BE}/plans`,
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

export const fetchEditPlan = async (id, data) => {
    const onError = 'Error al editar el plan';
    try {
        const response = await Promise.race([
            axios.put(
                `${API_BE}/plans/id/${id}`,
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


export const fetchDeletePlan = async (id) => {
    const onError = `Error al eliminar el plan`;
    try {
        const response = await Promise.race([
            axios.delete(
                `${API_BE}/plans/id/${id}`,
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