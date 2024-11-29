import { useRef, useCallback } from 'react';
import { DeleteIcon, EditIcon, RestartIcon, ToggleIcon, ViewIcon } from '../Icons';
import { fetchChangeStateChannel, fetchDeleteChannel, fetchRestartChannel } from '../../functions/fetch/channels.js';
import { toast } from 'react-toastify';

const useToast = () => {
    const toastId = useRef(null);
    const notify = useCallback((message) => {
        toastId.current = toast(message, { autoClose: false, theme: 'light' });
    }, []);
    const updateToast = useCallback((message, type) => {
        toast.update(toastId.current, { render: message, type, autoClose: 3000 });
    }, []);
    return { notify, updateToast };
};

const ChannelStatus = ({ status }) => {
    const statusMap = {
        running: { className: 'ok', text: 'Reproduciendo' },
        error: { className: 'error', text: 'Error' },
        waiting: { className: 'loading', text: 'Cargando' },
        default: { className: 'disabled', text: 'Desactivado' },
    };
    const { className, text } = statusMap[status] || statusMap.default;
    return <p className={className}>{text}</p>;
};

export const ChannelRow = ({ setChannelSelected, channel, usersSessions, categories, handleEditChannelClick }) => {
    const { notify, updateToast } = useToast();

    const showPrevisualization = useCallback(() => {
        setChannelSelected(channel._id);
        document.querySelector('.previsualization')?.classList.remove('hidden');
        document.querySelector('.table')?.classList.add('reduced');
    }, [channel._id, setChannelSelected]);

    const handleAction = useCallback(async (action, successMessage, errorMessage) => {
        notify(`${action} Canal ${channel.streamName}`);
        try {
            const response = await action();
            if (response.error) throw new Error(response.error);
            updateToast(successMessage, 'success');
        } catch (error) {
            updateToast(errorMessage, 'error');
        }
    }, [channel.streamName, notify, updateToast]);

    const handleRestartChannel = () => handleAction(
        () => fetchRestartChannel(channel._id),
        'Canal reiniciado correctamente',
        'No fue posible reiniciar el canal'
    );

    const handleToggleChannel = () => handleAction(
        () => fetchChangeStateChannel(channel._id, channel.disabled ? 'enable' : 'disable'),
        `Canal ${channel.disabled ? 'activado' : 'desactivado'} correctamente`,
        `No fue posible ${channel.disabled ? 'activar' : 'desactivar'} el canal`
    );

    const handleDeleteChannel = () => {
        notify(`Eliminando Canal ${channel.streamName}`);
        setTimeout(() => {
            if (window.confirm(`¿Estás seguro de eliminar el canal ${channel.streamName}?`)) {
                handleAction(
                    () => fetchDeleteChannel(channel._id),
                    'Canal eliminado correctamente',
                    'No fue posible eliminar el canal'
                );
            } else {
                updateToast('Solicitud de eliminación cancelada', 'error');
            }
        }, 1000);
    };

    const activeSessions = usersSessions?.sessions.filter(session => session.name === channel.name).length || 0;
    const category = categories?.find(category => category._id === channel.categoryId)?.categoryName || 'No identificado';

    const { stats } = channel;

    return (
        <div className="row">
            <div className="cell"><p>{channel.position}</p></div>
            <div className="cell"><img src={String(channel.logoUrl).replace('http://45.232.148.36:3333', '')} alt={channel.streamName} /></div>
            <div className="cell"><p>{channel.streamName}</p></div>
            <div className="cell"><ChannelStatus status={stats?.status} /></div>
            <div className="cell"><p>{category}</p></div>
            <div className="cell"><p>{stats?.bitrate || 0} kbit/s</p></div>
            <div className="cell">
                <p>
                    {Number((stats?.inputs_bandwidth || 0) / 1e6).toFixed(2)} Mbps /
                    {Number((stats?.output_bandwidth || 0) / 1e6).toFixed(2)} Mbps
                </p>
            </div>
            <div className="cell"><p>{activeSessions}/{stats?.playback_total_sessions || 0}</p></div>
            <div className="cell">
                <button title="Ver" onClick={showPrevisualization}><ViewIcon /></button>
                <button title="Editar" onClick={() => { showPrevisualization(); handleEditChannelClick(channel._id); }}>
                    <EditIcon />
                </button>
                <button title="Reiniciar" onClick={handleRestartChannel}><RestartIcon /></button>
                <button title={channel.disabled ? "Activar" : "Desactivar"} onClick={handleToggleChannel}>
                    <ToggleIcon disabled={!channel.disabled} />
                </button>
                <button title="Eliminar" onClick={handleDeleteChannel}><DeleteIcon /></button>
            </div>
        </div>
    );
};