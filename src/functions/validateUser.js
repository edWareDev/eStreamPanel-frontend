import { tryLogin } from "./fetch/auth";

export const validateUser = async (userIngresado, passwordIngresado) => {
    const userFound = await tryLogin({ userIngresado, passwordIngresado });

    if (userFound.error) {
        return userFound;
    }

    if (userFound) {
        return userFound;
    } else {
        return { error: 'Credenciales Incorrectas' };
    }
}