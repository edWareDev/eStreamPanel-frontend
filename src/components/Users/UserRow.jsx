import React, { useRef } from 'react'
import { DeleteIcon, DisconnectIcon, DownloadIcon, EditIcon, LinkIcon, ViewIcon } from '../Icons'
import { fetchDeleteChannel, fetchRestartChannel } from '../../functions/fetch/channels.js'
import { toast } from 'react-toastify';
import { fetchKillConnection } from '../../functions/fetch/sessions.js';
import { fetchDeleteUser } from '../../functions/fetch/users.js';

export const UserRow = ({ setUserSelected, user, usersSessions, plans, handleEditUserClick, handleDownloadPlaylistClick }) => {
    const killConnectionsId = useRef(null);
    const deleteId = useRef(null);
    const notify = (id, message) => id.current = toast(message, { autoClose: false, theme: 'light' });
    const updateFail = (id, error) => toast.update(id.current, { render: error, type: "error", autoClose: 3000 });
    const updateSuccess = (id, message) => toast.update(id.current, { render: message, type: "success", autoClose: 3000 });

    const showPrevisualization = () => {
        setUserSelected(user._id)

        const prev = document.querySelector('.previsualization')
        const table = document.querySelector('.table')

        prev.classList.remove('hidden')
        table.classList.add('reduced')
    }

    const handleEditUser = () => {
        showPrevisualization()
        handleEditUserClick(user._id)
    }

    const handleDownloadPlaylist = () => {
        handleDownloadPlaylistClick(user._id)
    }

    const handleDeleteUser = async () => {
        notify(deleteId, `Eliminando Usuario ${user.subscriberName}`)
        setTimeout(async () => {
            if (confirm(`¿Estás seguro de eliminar el usuario ${user.subscriberName}?`)) {
                const response = await fetchDeleteUser(user._id)
                response.error ? updateFail(deleteId, 'No fue posible eliminar el usuario') : updateSuccess(deleteId, 'Usuario eliminado correctamente')
            } else {
                updateFail(deleteId, 'Solicitad de eliminación cancelada')
            }
        }, 1000)

    }
    const estado = user.subscriberStatus

    let plan = undefined
    if (plans) {
        plan = plans.find(plan => plan._id === user.plan)
    }
    // CLIENTES
    const sessionsActive = []
    if (usersSessions) {
        usersSessions.sessions.forEach(sesion => {
            if (sesion.user_id === user._id) {
                sessionsActive.push(sesion)
            }
        })
    }

    const handleKillConnections = async () => {
        if (confirm(`¿Estás seguro de cerrar todas las conexiones de ${user.subscriberName}?`)) {
            notify(killConnectionsId, 'Terminando conexiones.')

            for (const session of sessionsActive) {
                const result = await fetchKillConnection(session.id)
                if (result.error) {
                    updateFail(killConnectionsId, 'No fue posible finalizar las sesiones.')
                }
            }
            updateSuccess(killConnectionsId, 'Sesiones Finalizadas.')
        }
    }

    return (
        <div className="row">
            <div className="cell"><p>{user.subscriberName}</p></div>
            <div className="cell">{<p className={estado ? 'ok' : 'error'} title={estado ? 'Activo' : user.subscriberDisabledReason}>{estado ? 'Activo' : 'Inactivo'}</p>}</div>
            <div className="cell"><p className={plan ? '' : 'error'}>{plan?.planName || 'Plan No Identificado'}</p></div>
            <div className="cell"><p>{sessionsActive?.length || 0}/{user?.maxSessions || 0}</p></div>
            <div className="cell" title={user.comment}><p>{user.comment}</p></div>
            <div className="cell">
                <button title="Ver" onClick={showPrevisualization}>
                    <ViewIcon />
                </button>

                <button title="Editar" onClick={handleEditUser}>
                    <EditIcon />
                </button>

                <button title="Obtener Playlist" onClick={handleDownloadPlaylist}>
                    <LinkIcon />
                </button>

                <button title="Desconectar Dispositivos" onClick={handleKillConnections}>
                    <DisconnectIcon />
                </button>

                <button title="Eliminar" onClick={handleDeleteUser}>
                    <DeleteIcon />
                </button>
            </div>
        </div>
    )
}
