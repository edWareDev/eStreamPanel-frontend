import '../assets/sass/main.scss'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Aside from './components/Aside';
import Main from './components/Main';
import { useEffect, useState } from 'react';
import { Login } from './components/Login';
import CryptoJS from 'crypto-js';
import { validateUser } from './functions/validateUser';

function App() {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)

    useEffect(() => {
        const SALT = import.meta.env.VITE_API_APP_S_4_L_T_GF
        const decrypt = (encryptedData) => {
            if (!encryptedData) return '';
            const decryptedData = CryptoJS.AES.decrypt(encryptedData, SALT).toString(CryptoJS.enc.Utf8);
            return decryptedData;
        }

        const fetchUserData = async () => {
            const userStoraged = localStorage.getItem('eStreamPanelData');
            if (userStoraged) {
                const dUserToStorage = JSON.parse(decrypt(userStoraged));
                const difference = (+new Date() - Number(dUserToStorage.loginDate));
                if (Number(difference / 1000).toFixed(0) < 86400000) {
                    const resultValidateUser = await validateUser(dUserToStorage.user, dUserToStorage.password);
                    if (!resultValidateUser?.error) {
                        setUser(resultValidateUser.user);
                        setRole(resultValidateUser.role);
                    }
                }
            }
        };
        fetchUserData();
    }, [])

    return (
        <>
            {
                user ?
                    <>
                        <Aside setUser={setUser} setRole={setRole} role={role} />
                        <Main setUser={setUser} setRole={setRole} role={role} />
                    </>
                    :
                    <Login setUser={setUser} setRole={setRole} />
            }
            <ToastContainer style={{ fontSize: "1.4rem" }} pauseOnFocusLoss={false} position={'bottom-right'} />
        </>
    );
}

export default App;