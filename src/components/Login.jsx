import React, { useRef } from 'react'
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import { validateUser } from '../functions/validateUser';

const encrypt = (data) => {
    const SALT = import.meta.env.VITE_API_APP_S_4_L_T_GF
    const stringData = String(data)
    if (!stringData) return '';
    const encryptedData = CryptoJS.AES.encrypt(stringData, SALT).toString();
    return encryptedData;
}

export const Login = ({ setUser, setRole }) => {
    const toastId = useRef(null);
    const notify = () => toastId.current = toast("Iniciando Sesión", { autoClose: false, theme: 'light' });
    const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
    const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });



    const sendData = async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const formUserManager = event.currentTarget;
        const formData = new FormData(formUserManager);

        notify()
        const resultValidateUser = await validateUser(formData.get('user'), formData.get('password'));
        setTimeout(() => {
            if (resultValidateUser.error) {
                updateFail(resultValidateUser.error)
            } else {
                setUser(resultValidateUser.user)
                setRole(resultValidateUser.role)
                const userToStorage = { ...resultValidateUser, loginDate: +new Date }

                const eUserToStorage = encrypt(JSON.stringify(userToStorage))
                localStorage.setItem('eStreamPanelData', eUserToStorage)
                updateSuccess(`Bienvenido ${resultValidateUser.name}`)
            }
        }, 1000)
    }

    return (
        <div className='login'>
            <div className="loginModal">

                <h1 className="appTitle">eStreamPanel</h1>
                <form method='post' onSubmit={sendData} className='loginUser'>
                    <div className='data'>
                        <label htmlFor="user">
                            <p>Nombre de Usuario:</p>
                            <input type="text" name='user' id='user' autoComplete='off' required />
                        </label>

                        <label htmlFor="password">
                            <p>Contraseña:</p>
                            <input type="password" name='password' id='password' autoComplete='off' required />
                        </label>
                    </div>
                    <div className='buttons' >
                        <button type='submit' >Iniciar Sesión</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
