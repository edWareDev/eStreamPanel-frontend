import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import Channels from './Channels';
import Users from './Users';
import Packages from './Packages';
import Plans from './Plans';
import { useEffect, useState } from 'react';
import { fetchServerStats } from '../functions/fetchToBackEnd';
import Categories from './Categories';
import { toast } from 'react-toastify';
import ServerStats from './Main/ServerStats';
import { fetchSessions } from '../functions/fetch/sessions';
import { fetchChannels } from '../functions/fetch/channels';

const Main = ({ setUser, setRole, role }) => {

    const [intervalDuration, setIntervalDuration] = useState(2000)
    const [serverStats, setServerStats] = useState({})
    const [usersSessions, setUsersSessions] = useState(undefined)

    useEffect(() => {
        let intentoError = 0;
        const fetchData = async () => {
            const serverStatsFetched = await fetchServerStats();
            if (serverStatsFetched) {
                if (serverStatsFetched.error) {
                    toast.error(serverStatsFetched.error);
                    if (intentoError < 2) {
                        console.log('REINTENTO N:', intentoError);
                        intentoError++;
                    } else {
                        setIntervalDuration(10000);
                        console.log('MODO LENTO A INTERVALOS DE', 10000);
                    }
                } else {
                    setServerStats(serverStatsFetched);
                    setIntervalDuration(2000);
                }
            }

            const usersSessionsFetched = await fetchSessions();
            if (usersSessionsFetched) {
                if (usersSessionsFetched.error) {
                    toast.error(usersSessionsFetched.error);
                } else {
                    setUsersSessions(usersSessionsFetched);
                }
            }
        };

        // Limpiar el intervalo anterior antes de crear uno nuevo
        const serverStatsInterval = setInterval(fetchData, intervalDuration);

        // Limpieza del intervalo al desmontar el componente
        return () => {
            clearInterval(serverStatsInterval);
        };
    }, [intervalDuration]);
    return (
        <main>
            <header>
                <Routes>
                    <Route path='/' element={<div className="pageTitle">INICIO</div>} />
                    {
                        role === 'administrator' ?
                            <>
                                <Route path='/channels' element={<div className="pageTitle">CANALES</div>} />
                                <Route path='/users' element={<div className="pageTitle">USUARIOS</div>} />
                                <Route path='/categories' element={<div className="pageTitle">CATEGORIAS</div>} />
                                <Route path='/packages' element={<div className="pageTitle">PAQUETES</div>} />
                                <Route path='/plans' element={<div className="pageTitle">PLANES</div>} />
                            </>
                            : role === 'contentManager'
                                ?
                                <>
                                    <Route path='/users' element={<div className="pageTitle">USUARIOS</div>} />
                                    <Route path='/categories' element={<div className="pageTitle">CATEGORIAS</div>} />
                                    <Route path='/packages' element={<div className="pageTitle">PAQUETES</div>} />
                                </>
                                : role === 'monitor'
                                    ?
                                    <>
                                        <Route path='/users' element={<div className="pageTitle">USUARIOS</div>} />
                                    </>
                                    :
                                    <></>
                    }
                    <Route path='/settings' element={<div className="pageTitle">AJUSTES</div>} />
                </Routes>
                <ServerStats serverStats={serverStats} usersSessions={usersSessions} />
            </header>
            <div className="content">
                <Routes>
                    <Route path='/' element={<Home />} />
                    {
                        role === 'administrator' ?
                            <>
                                <Route path='/channels' element={<Channels usersSessions={usersSessions} intervalDuration={intervalDuration} />} />
                                <Route path='/users' element={<Users usersSessions={usersSessions} intervalDuration={intervalDuration} />} />
                                <Route path='/categories' element={<Categories intervalDuration={intervalDuration} />} />
                                <Route path='/packages' element={<Packages intervalDuration={intervalDuration} />} />
                                <Route path='/plans' element={<Plans intervalDuration={intervalDuration} />} />
                            </>
                            : role === 'contentManager'
                                ?
                                <>
                                    <Route path='/users' element={<Users usersSessions={usersSessions} intervalDuration={intervalDuration} />} />
                                    <Route path='/categories' element={<Categories intervalDuration={intervalDuration} />} />
                                    <Route path='/packages' element={<Packages intervalDuration={intervalDuration} />} />
                                </>
                                : role === 'monitor'
                                    ?
                                    <>
                                        <Route path='/users' element={<Users usersSessions={usersSessions} intervalDuration={intervalDuration} />} />
                                    </>
                                    :
                                    <></>
                    }
                    <Route path='/settings' element={<Home />} />
                    <Route path='/logoff' element={<Home />} />
                </Routes>
            </div>
        </main>
    );
};

export default Main;