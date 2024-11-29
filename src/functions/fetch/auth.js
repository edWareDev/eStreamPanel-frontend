import axios from "axios";
import { AUTH_BE } from "../fetchToBackEnd";
import { timeoutPromise } from "../timeoutPromise";

export const tryLogin = async ({ userIngresado, passwordIngresado }) => {
    const onError = 'No fue posible iniciar sesión';
    try {
        const response = await Promise.race([
            axios.post(
                `${AUTH_BE}/login`,
                { email: userIngresado, password: passwordIngresado },
                {
                    headers: {
                        'Content-Type': 'application/json',  // Asegúrate de establecer el tipo de contenido correcto
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