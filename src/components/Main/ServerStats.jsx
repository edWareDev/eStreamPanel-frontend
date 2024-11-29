
const ServerStats = ({ serverStats, usersSessions }) => {

    const { streamer_status, cpu_usage, memory_usage, online_streams, total_streams, uptime } = serverStats
    const timeAlive =
        streamer_status === 'running'
            ? [
                uptime / 86400 | 0,
                (uptime / 3600) % 24 | 0,
                (uptime / 60) % 60 | 0
            ]
                .filter((v, i) => v || i === 0) // Corregido aquí
                .map((v, i) => v + ['d', 'h', 'm'][i])
                .join(' ')
            : String(streamer_status || '--').toUpperCase();

    const realSessions = []
    if (usersSessions) {
        usersSessions.sessions.forEach(sesion => {
            if (sesion.user_id) {
                realSessions.push(sesion)
            }
        })
    }

    return (
        <div className="serverStats">
            <div className="aliveTime">
                <label>Activo: <span>{timeAlive ? timeAlive : '--'}</span></label>
            </div>
            <div className="cpu">
                <label>Procesador: <span>{cpu_usage}%</span></label>
            </div>
            <div className="memory">
                <label>Memoria: <span>{memory_usage}%</span></label>
            </div>
            <div className="channels">
                <label>Canales: <span>{online_streams}/{total_streams}</span></label>
            </div>
            <div className="devices">
                <label>Dispositivos: <span>{realSessions.length}</span></label>
            </div>
        </div>
    );
};

export default ServerStats;

