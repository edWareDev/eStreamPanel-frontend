import { CategoryIcon, ChannelsIcon, ExitIcon, HomeIcon, PackagesIcon, PlansIcon, SettingsIcon, UsersIcon } from './Icons';
import { useState } from 'react';
import { NavItem } from './Aside/NavItem';

const Aside = ({ setUser, setRole, role }) => {
    const [pageTitle, setPageTitle] = useState('');

    const handleLogOff = () => {
        localStorage.removeItem('eStreamPanelData')
        setUser(null)
        setRole(null)
    }

    return (
        <aside>
            <button className='logoContainer' onClick={() => { location.href = '.' }}>eStreamPanel</button>
            <nav>
                <ul>
                    <NavItem destiny='' pageTitle='Inicio' ImageIcon={HomeIcon} setPageTitle={setPageTitle} />
                    {
                        role === 'administrator' ?
                            <>
                                <NavItem destiny='channels' pageTitle='Canales' ImageIcon={ChannelsIcon} setPageTitle={setPageTitle} />
                                <NavItem destiny='users' pageTitle='Usuarios' ImageIcon={UsersIcon} setPageTitle={setPageTitle} />
                                <NavItem destiny='categories' pageTitle='Categorias' ImageIcon={CategoryIcon} setPageTitle={setPageTitle} />
                                <NavItem destiny='packages' pageTitle='Paquetes' ImageIcon={PackagesIcon} setPageTitle={setPageTitle} />
                                <NavItem destiny='plans' pageTitle='Planes' ImageIcon={PlansIcon} setPageTitle={setPageTitle} />
                            </>
                            : role === 'contentManager'
                                ?
                                <>
                                    <NavItem destiny='users' pageTitle='Usuarios' ImageIcon={UsersIcon} setPageTitle={setPageTitle} />
                                    <NavItem destiny='categories' pageTitle='Categorias' ImageIcon={CategoryIcon} setPageTitle={setPageTitle} />
                                    <NavItem destiny='packages' pageTitle='Paquetes' ImageIcon={PackagesIcon} setPageTitle={setPageTitle} />
                                </>
                                : role === 'monitor'
                                    ?
                                    <>
                                        <NavItem destiny='users' pageTitle='Usuarios' ImageIcon={UsersIcon} setPageTitle={setPageTitle} />
                                    </>
                                    :
                                    <></>
                    }

                </ul>
                <ul>
                    {/* <NavItem destiny='settings' pageTitle='Ajustes' ImageIcon={SettingsIcon} setPageTitle={setPageTitle} /> */}
                    <button onClick={handleLogOff}>
                        <ExitIcon />
                        Salir
                    </button>
                </ul>
            </nav>
        </aside>
    );
};

export default Aside;