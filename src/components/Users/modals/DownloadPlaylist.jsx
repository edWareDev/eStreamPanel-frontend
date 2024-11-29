import { useEffect, useRef, useState } from 'react'
// import { fetchEditChannel } from '../../../functions/Channels/fetchsToBackEnd.js';
import { toast } from 'react-toastify';
import { fetchEditUser } from '../../../functions/fetch/users';
import { CloseIcon, CopyIcon, DownloadIcon } from '../../Icons';

export const DownloadUserPlaylist = ({ plans, users, userId, setShowModal }) => {
    const toastId = useRef(null);
    const notify = (msg) => toastId.current = toast(msg, { autoClose: false, theme: 'light', position: "bottom-right" });
    const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
    const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });

    const user = users.find(user => user._id === userId)

    const [format, setFormat] = useState('')
    const [urlPlaylist, setUrlPlaylist] = useState('')


    useEffect(() => {
        // Actualizar subscriberStatus cuando cambia el subscriberStatus
        setFormat(user.subscriberStatus ? "1" : "0");
        setUrlPlaylist('')
    }, [userId, user.subscriberStatus]);


    const handleUrlChange = (e) => {
        const value = e.target.value
        setFormat(value);
        if (value === '') {
            setUrlPlaylist('')
        } else {
            const URL_FS = import.meta.env.VITE_API_FS
            const URL_LOCAL_FS = import.meta.env.VITE_API_LOCAL_FS
            const user = users.find(user => user._id === userId)
            const playlistUrl = `${URL_LOCAL_FS}/auth/${user.subscriberName}/${user.subscriberPassword}/playlist/m3u8/${value === 'hls' ? 'hls' : 'ts'}`
            setUrlPlaylist(playlistUrl)
        }
    };

    const handleCopyUrlPlaylist = async () => {
        try {
            if (urlPlaylist === '') throw new Error('Seleccione el formato.')
            await navigator.clipboard.writeText(urlPlaylist);
            toast.success('Copiado al portapeles')
        } catch (error) {
            toast.error(error.message)
            console.error('Error al copiar texto al portapapeles:', error);
        }
    }

    const handleDownloadPlaylist = () => {
        try {
            if (urlPlaylist === '') throw new Error('Seleccione el formato.')
            const nameFile = "playlist.m3u8"

            const tempA = document.createElement('a')
            tempA.href = urlPlaylist
            tempA.download = nameFile

            document.body.appendChild(tempA);
            tempA.click();
            document.body.removeChild(tempA);
            toast.success('Descargando')
        } catch (error) {
            toast.error(error.message)
            console.error('Error al copiar descargar playlist:', error);
        }
    }

    const reset = () => {
        setShowModal(false)
    }


    return (
        <div className='playlistDownload'>
            <div className="modalTitle">
                Obtener Playlist
            </div>
            <div className="playlistData">
                <p>Seleccione el formato de reproducción:</p>
                <select name="playlistFormat" title='Estado del Usuario' required value={format} onChange={handleUrlChange}>
                    <option key="none" value="">Seleccione</option>
                    <option key="hls" value="hls">HTTP Live Streaming</option>
                    <option key="ts" value="ts">Transport Stream</option>
                </select>
            </div>
            <div className="playlistGenerated">
                <input id='urlPlaylist' type="url" defaultValue={urlPlaylist} disabled onMouseDown={(e) => { e.preventDefault() }} />

                <button title='Copiar Enlace' onClick={handleCopyUrlPlaylist}>
                    <CopyIcon />
                </button>

                <button title='Descargar Playlist' onClick={handleDownloadPlaylist}>
                    <DownloadIcon />
                </button>
            </div>
            <button title='Cerrar Modal' onClick={reset}><CloseIcon /></button>
        </div>
    )
}
