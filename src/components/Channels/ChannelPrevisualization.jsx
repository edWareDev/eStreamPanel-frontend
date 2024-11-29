import { useEffect, useState } from "react";
import { API_FS, fetchAdminViewToken } from "../../functions/fetchToBackEnd"
import { CloseIcon } from "../Icons"

export const ChannelPrevisualization = ({ channels, channelId }) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const getToken = async () => {
            const tokenData = await fetchAdminViewToken();
            setToken(tokenData);
        };

        getToken();
    }, []);

    const hidePrevisualization = () => {
        const prev = document.querySelector('.previsualization')
        const table = document.querySelector('.table')
        const iframe = prev.querySelector('iframe')
        iframe.setAttribute('src', '')

        prev.classList.add('hidden')
        table.classList.remove('reduced')
    }

    const channel = channels.find(channel => channel._id === channelId)
    if (channel) {
        const { stats = {} } = channel || {};

        const { alive = false, inputs_bytes = 0, bytes_out = 0, playback_bytes = 0, opened_at = 0, retry_count = 0, ts_delay = 0, client_count = 0, online_clients = 0, source_error = '', } = stats;


        const video = channel?.stats?.media_info?.tracks ? channel?.stats?.media_info?.tracks.find(track => track.content === 'video') : []
        const audio = channel?.stats?.media_info?.tracks ? channel?.stats?.media_info?.tracks.find(track => track.content === 'audio') : []

        const { codec: codecVideo = 'No detectado', width, height, bitrate: bitrateVideo, fps: fpsVideo } = video
        const { codec: codecAudio = 'No detectado', channels: channelsAudio, bitrate: bitrateAudio, sampleRate } = audio

        const channelStatus = {}
        if (alive) {
            channelStatus.className = 'status ok'
            channelStatus.text = 'Activo'
        } else {
            channelStatus.className = 'status error'
            channelStatus.text = 'Error'
        }

        // Tiempo Activo
        const s = opened_at > 0 ? ((Date.now() - opened_at) / 1000) | 0 : 0;
        const days = (s / 86400) | 0;
        const hours = ((s / 3600) % 24) | 0;
        const minutes = ((s / 60) % 60) | 0;

        return (
            <div className="previsualization">
                <div className="data">
                    <div className="windowTitle">
                        <div className={channelStatus.className}>{channelStatus.text}</div>
                        <div className="name">{channel.streamName || 'Desconocido'}</div>
                        <div className="id">({channel._id || 'Desconocido'})</div>
                    </div>
                    <div className="windowData">
                        <div className="streamInfo">
                            <div className="statistics">
                                <div className="sectionTitle">ESTADÍSTICAS</div>
                                <div className="sectionContent">
                                    <label>Bytes (I/O): <span>{Number((inputs_bytes || 0) / (1024 * 1024)).toFixed(2)}/{Number((bytes_out || 0) / (1024 * 1024)).toFixed(2)}</span></label>
                                    <label>Plaback Bytes: <span>{playback_bytes || 0}</span></label>
                                    <label>Tiempo Activo: <span>{days + "d " + hours + "h " + minutes + "m"}</span></label>
                                    <label>Reintentos: <span>{retry_count || 0}</span></label>
                                </div>
                            </div>
                            <div className="connections">
                                <div className="sectionTitle">CONEXIONES</div>
                                <div className="sectionContent">
                                    <label>TS Delay: <span className={ts_delay < 10000 ? 'textOk' : 'textError'}>{ts_delay || 0}</span></label>
                                    <label>Clientes en Total: <span>{client_count || 0}</span></label>
                                    <label>Clientes en Linea: <span>{online_clients || 0}</span></label>
                                    <label>Source Error: <span className={source_error ? 'textError' : 'textOk'}>{source_error || 'Ninguno'}</span></label>
                                </div>
                            </div>
                        </div>
                        <div className="mediaInfo">
                            <div className="video">
                                <div className="sectionTitle">VIDEO</div>
                                <div className="sectionContent">
                                    <label>Codec: <span>{String(codecVideo).toUpperCase()}</span></label>
                                    <label>Resolución: <span>{width || 0}×{height || 0}</span></label>
                                    <label>Bitrate: <span>{bitrateVideo || 0}</span></label>
                                    <label>FPS: <span className={Number(fpsVideo || 0) > 25 ? 'textOk' : 'textError'}>{Number(fpsVideo || 0).toFixed(2)}</span></label>
                                </div>
                            </div>
                            <div className="audio">
                                <div className="sectionTitle">AUDIO</div>
                                <div className="sectionContent">
                                    <label>Codec: <span>{String(codecAudio).toUpperCase()}</span></label>
                                    <label>Canales: <span>{channelsAudio || 0}</span></label>
                                    <label>Bitrate: <span>{bitrateAudio || 0}</span></label>
                                    <label>Sample Rate: <span>{sampleRate || 0}</span></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="videoContainer">
                    <iframe allowFullScreen src={`${API_FS}/${channel._id}/embed.html?tokenName=token&token=${token.token}&autoplay=false`} frameBorder="0"></iframe>
                </div>
                <button title='Cerrar Modal' onClick={hidePrevisualization}><CloseIcon /></button>
            </div>
        )
    }
    return (<div className="previsualization hidden"></div>)
}
