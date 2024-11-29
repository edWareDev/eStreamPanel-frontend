import { useEffect, useRef, useState } from 'react'
// import { fetchEditChannel } from '../../../functions/Channels/fetchsToBackEnd.js';
import { toast } from 'react-toastify';
import { fetchEditUser } from '../../../functions/fetch/users';

export const EditUser = ({ plans, users, userId, setShowModal }) => {
    const toastId = useRef(null);
    const notify = () => toastId.current = toast("Editando Canal", { autoClose: false, theme: 'light', position: "bottom-right" });
    const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
    const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });

    const user = users.find(user => user._id === userId)

    const [planId, setPlanId] = useState(user.plan || '')
    const [estado, setEstado] = useState(user.subscriberStatus ? "1" : "0" || '')

    useEffect(() => {
        // Actualizar categoryId cuando cambia el channelId
        setPlanId(user.plan || '');
    }, [userId, user.plan]);

    useEffect(() => {
        // Actualizar subscriberStatus cuando cambia el subscriberStatus
        setEstado(user.subscriberStatus ? "1" : "0");
    }, [userId, user.subscriberStatus]);

    const handlePlanChange = (e) => {
        setPlanId(e.target.value);
    };

    const handleStatusChange = (e) => {
        setEstado(e.target.value);
    };

    const sendData = async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const formUserManager = event.currentTarget;
        const formData = new FormData(formUserManager);

        notify()
        const resultEditUser = await fetchEditUser(userId, formData);
        setTimeout(() => {
            if (resultEditUser.error) {
                updateFail(resultEditUser.error)
            } else {
                updateSuccess("Usuario modificado satisfactoriamente")
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
                Editar Usuario
            </div>
            <form method='post' onSubmit={sendData} onReset={reset} className='formEditUser'>
                <div>
                    <label htmlFor="streamName">
                        <p>Nombre de Usuario:</p>
                        <input type="text" name='subscriberName' id='subscriberName' autoComplete='off' required defaultValue={user?.subscriberName || 'Desconocido'} />
                    </label>

                    <label htmlFor="subscriberPassword">
                        <p>Contraseña:</p>
                        <input type="password" name='subscriberPassword' id='subscriberPassword' autoComplete='off' required defaultValue={user.subscriberPassword} />
                    </label>
                </div>
                <div>
                    <label htmlFor="plan">
                        <p>Plan:</p>
                        <select name="plan" title='Plan' required value={planId || ''} onChange={handlePlanChange}>
                            {
                                plans.map(plan => (
                                    <option key={plan._id} value={plan._id}>
                                        {plan.planName}
                                    </option>
                                ))
                            }
                            <option value=''>No definido</option>
                        </select>
                    </label>
                </div>

                <div>
                    <div>
                        <label htmlFor="devices">
                            <p>Dispositivos:</p>
                            <input type="number" min="1" name='devices' id='devices' autoComplete='off' required defaultValue={user.maxSessions || 0} />
                        </label>
                        <label htmlFor="subscriberStatus">
                            <p>Estado:</p>
                            <select name="subscriberStatus" title='Estado del Usuario' required value={estado} onChange={handleStatusChange}>
                                <option key="activo" value="1">Activo</option>
                                <option key="inactivo" value="0">Inactivo</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="comment">
                            <p>Comentario:</p>
                            <input type="text" name='comment' id='comment' autoComplete='off' defaultValue={user.comment} />
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
