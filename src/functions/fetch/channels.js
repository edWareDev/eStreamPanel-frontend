import axios from "axios";
import { timeoutPromise } from "../timeoutPromise";
import { API_BE } from "../fetchToBackEnd";


export const fetchChannels = async () => {
    const onError = 'Error al obtener los canales';
    try {
        const response = await Promise.race([
            axios.get(
                `${API_BE}/streams`,
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

export const fetchCreateChannel = async (data) => {
    const onError = 'Error al crear el canal';
    try {
        const response = await Promise.race([
            axios.post(
                `${API_BE}/streams`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
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

export const fetchEditChannel = async (id, data) => {
    const onError = 'Error al editar el canal';
    try {
        const response = await Promise.race([
            axios.put(
                `${API_BE}/streams/id/${id}`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',  // Asegúrate de establecer el tipo de contenido correcto
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

export const fetchRestartChannel = async (id) => {
    const onError = `Error al reiniciar el canal`;
    try {
        const response = await Promise.race([
            axios.post(
                `${API_BE}/streams/id/${id}/restart`,
                {},
                {
                    headers: {
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

export const fetchChangeStateChannel = async (id, action) => {
    const onError = `Error al ${action === 'enable' ? 'activar' : 'desactivar'} el canal`;
    try {
        const response = await Promise.race([
            axios.post(
                `${API_BE}/streams/id/${id}/${action}`,
                {},
                {
                    headers: {
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

export const fetchDeleteChannel = async (id) => {
    const onError = `Error al eliminar el canal`;
    try {
        const response = await Promise.race([
            axios.delete(
                `${API_BE}/streams/id/${id}`,
                {
                    headers: {
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