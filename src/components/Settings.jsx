import { useEffect } from 'react';

let settingsIntervalId = 0;

const Settings = () => {
    useEffect(() => {
        settingsIntervalId = setInterval(() => { console.log('AJUSTES') }, 2000);
        return () => {
            clearInterval(settingsIntervalId);
        };
    }, []);

    return (
        <div className='settings'>
            <h1>Ajustes</h1>
        </div>
    );
};

export default Settings;