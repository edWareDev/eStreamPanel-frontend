import DeviceDetector from "device-detector-js"
import { CloseIcon, DisconnectIcon } from "../Icons"
import { convertirSegundos } from './../../functions/convertirSegundos';
import { convertirBytes } from "../../functions/convertirBytes";
import { fetchKillConnection } from "../../functions/fetch/sessions";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { fetchChannels } from "../../functions/fetch/channels.js";

export const UserPrevisualization = ({ users, usersSessions, userSelected }) => {
    const [allChannels, setAllChannels] = useState([])
    useEffect(() => {
        const getAllChannels = async () => {
            const getChannels = await fetchChannels()
            if (getChannels) setAllChannels(getChannels)
        }
        getAllChannels()
    }, [])
    const killConnectionId = useRef(null);

    const notify = (id, message) => id.current = toast(message, { autoClose: false, theme: 'light' });
    const updateFail = (id, error) => toast.update(id.current, { render: error, type: "error", autoClose: 3000 });
    const updateSuccess = (id, message) => toast.update(id.current, { render: message, type: "success", autoClose: 3000 });

    const hidePrevisualization = () => {
        const prev = document.querySelector('.previsualization')
        const table = document.querySelector('.table')

        prev.classList.add('hidden')
        table.classList.remove('reduced')
    }

    const handleKillConnection = async (id, device) => {
        if (confirm(`¿Estás seguro de desconectar ${device}?`)) {
            notify(killConnectionId, 'Terminando conexion.')

            const result = await fetchKillConnection(id)
            if (result.error) {
                updateFail(killConnectionId, 'No fue posible finalizar la sesion.')
            }
            updateSuccess(killConnectionId, 'Sesion Finalizada.')
        }
    }

    if (usersSessions && userSelected) {
        const userSessions = usersSessions.sessions.filter(session => session.user_id === userSelected)
        const user = users.find(user => user._id === userSelected)
        return (
            <div className="previsualization">
                <div className="data">
                    <div className="windowTitle">
                        <div className={`qConnections ${userSessions?.length >= user?.maxSessions ? 'error' : 'ok'} `}>{userSessions?.length || 0}/{user?.maxSessions || 0}</div>
                        <div className="name">{user.subscriberName}</div>
                    </div>
                    <div className="windowData">
                        <div className="usersSessionsTable">
                            <div className="usersSessionsTable--head">
                                <div className="row">
                                    <div className="cell">Dispositivo</div>
                                    <div className="cell">Tiempo de Uso</div>
                                    <div className="cell">Canal</div>
                                    <div className="cell">Protocolo</div>
                                    <div className="cell">IP</div>
                                    <div className="cell">Datos Consumidos</div>
                                    <div className="cell">Desconectar Dispositivo</div>
                                </div>
                            </div>
                            <div className="usersSessionsTable--body">
                                {
                                    userSessions.map((userSession) => {
                                        const deviceDetector = new DeviceDetector()
                                        const device = deviceDetector.parse(userSession.user_agent);
                                        const dispositivo = (device?.client?.version === "71.0" && device?.os?.version === "7.0") ? 'IPTV BOX GLOBAL FIBER' : `${String(device?.device?.type || (String(device?.client?.type) || "")).toUpperCase()} ${String(device?.device?.brand || String(device?.client?.name)).toUpperCase()} ${String(device?.os?.name || "").toUpperCase()}`
                                        const canal = allChannels.find(channel => channel._id === userSession.name)
                                        const tiempoDeUso = convertirSegundos(Number((+new Date - userSession.opened_at) / 1000).toFixed() || 0)
                                        const bytesConsumidos = convertirBytes(userSession.bytes)
                                        return (
                                            <div className="row" key={userSession.id}>
                                                <div className="cell">{dispositivo}</div>
                                                <div className="cell">{tiempoDeUso}</div>
                                                <div className="cell">{canal?.streamName || ''}</div>
                                                <div className="cell">{userSession?.proto || ''}</div>
                                                <div className="cell">{`${userSession.country}: ${userSession.ip}`}</div>
                                                <div className="cell">{bytesConsumidos}</div>
                                                <div className="cell">
                                                    <button title="Desconectar Dispositivo" onClick={() => { handleKillConnection(userSession.id, dispositivo) }}>
                                                        <DisconnectIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <button title='Cerrar Modal' onClick={hidePrevisualization}><CloseIcon /></button>
            </div>
        )
    }
    return (<div className="previsualization hidden"></div>)
}
