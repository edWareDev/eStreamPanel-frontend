import React, { useRef } from 'react'
import { toast } from 'react-toastify';
import { fetchCreateUser } from '../../../functions/fetch/users';

export const CreateUser = ({ plans, setShowModal }) => {
    const toastId = useRef(null);
    const notify = () => toastId.current = toast("Creando Canal", { autoClose: false, theme: 'light' });
    const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
    const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });

    const sendData = async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const formUserManager = event.currentTarget;
        const formData = new FormData(formUserManager);

        notify()
        const resultCreateUser = await fetchCreateUser(formData);
        setTimeout(() => {
            if (resultCreateUser.error) {
                updateFail(resultCreateUser.error)
            } else {
                updateSuccess("Usuario creado satisfactoriamente")
                formUserManager.reset()
            }
        }, 1000)
    }

    const reset = () => {
        setShowModal(false)
    }

    return (
        <div className='manageUser'>
            <div className="modalTitle">
                Crear Usuario
            </div>
            <form method='post' onSubmit={sendData} onReset={reset} className='formCreateUser'>
                <div>
                    <label htmlFor="subscriberName">
                        <p>Nombre de Usuario:</p>
                        <input type="text" name='subscriberName' id='subscriberName' autoComplete='off' required />
                    </label>

                    <label htmlFor="subscriberPassword">
                        <p>Contraseña:</p>
                        <input type="password" name='subscriberPassword' id='subscriberPassword' autoComplete='off' required />
                    </label>
                </div>
                <div>
                    <label htmlFor="plan">
                        <p>Plan:</p>
                        <select name="plan" title='Plan' required>
                            {
                                plans.map(plan => <option key={plan._id} value={plan._id}>{plan.planName}</option>)
                            }
                        </select>
                    </label>
                </div>
                <div>
                    <div>
                        <label htmlFor="devices">
                            <p>Dispositivos:</p>
                            <input type="number" min="1" name='devices' id='devices' autoComplete='off' required defaultValue="5" />
                        </label>
                        <label htmlFor="subscriberStatus">
                            <p>Estado:</p>
                            <select name="subscriberStatus" title='Estado del Usuario' required>
                                <option key="activo" value="1">Activo</option>
                                <option key="inactivo" value="0">Inactivo</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="comment">
                            <p>Comentario:</p>
                            <input type="text" name='comment' id='comment' autoComplete='off' />
                        </label>
                    </div>
                </div>
                <div >
                    <button type='submit' >Guardar</button>
                    <button type='reset' >Cancelar</button>
                </div>
            </form>
        </div>
    )
}
