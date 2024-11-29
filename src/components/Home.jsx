import { useEffect } from 'react';

let homeIntervalId = 0;

const Home = () => {
    useEffect(() => {
        homeIntervalId = setInterval(() => { console.log('HOME') }, 2000);
        return () => {
            clearInterval(homeIntervalId);
        };
    }, []);

    return (
        <div className='home'>
            <h1>INICIO</h1>
        </div>
    );
};

export default Home;