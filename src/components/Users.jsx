import { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon } from './Icons';
import { UserPrevisualization } from './Users/UserPrevisualization';
import { UserRow } from './Users/UserRow';
import { Grid } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { fetchUsers } from '../functions/fetch/users.js';
import { EditUser } from './Users/modals/EditUser';
import { CreateUser } from './Users/modals/CreateUser';
import { fetchPlans } from './../functions/fetch/plans';
import { DownloadUserPlaylist } from './Users/modals/DownloadPlaylist.jsx';

const Users = ({ usersSessions, intervalDuration }) => {

    const [userSelected, setUserSelected] = useState()
    const [users, setUsers] = useState([])
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalComponent, setModalComponent] = useState(null);

    const handleCreateUserClick = () => {
        setModalComponent(<CreateUser plans={plans} setShowModal={setShowModal} />);
        setShowModal(true);
    };

    const handleEditUserClick = (id) => {
        setModalComponent(<EditUser plans={plans} users={users} userId={id} setShowModal={setShowModal} />);
        setShowModal(true);
    };

    const handleDownloadPlaylistClick = (id) => {
        setModalComponent(<DownloadUserPlaylist plans={plans} users={users} userId={id} setShowModal={setShowModal} />);
        setShowModal(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            const usersFetched = await fetchUsers();
            if (usersFetched) {
                if (usersFetched.error) {
                    toast.error(usersFetched.error);
                } else {
                    setUsers(usersFetched);
                    setLoading(false)
                }
            }

            const plansFetched = await fetchPlans();
            if (plansFetched) {
                if (plansFetched.error) {
                    toast.error(plansFetched.error);
                } else {
                    setPlans(plansFetched);
                }
            }
        };

        fetchData()
        // Limpiar el intervalo anterior antes de crear uno nuevo
        const usersInterval = setInterval(fetchData, intervalDuration);

        // Limpieza del intervalo al desmontar el componente
        return () => {
            clearInterval(usersInterval);
        };
    }, [intervalDuration]);

    return (
        <div className="users" onKeyDown={(e) => { e.keyCode === 27 && setShowModal(false) }}>
            {loading ? <Grid /> : (
                <>
                    <UserPrevisualization users={users} usersSessions={usersSessions} userSelected={userSelected} />

                    <div className="options">
                        <div className="filtersContainer">
                            <div className="searchContainer">
                                <input type="text" placeholder="Buscar" />
                                <button title='Buscar'>
                                    <SearchIcon />
                                </button>
                            </div>
                        </div>
                        <div className="buttonsContainer">
                            <button className='createUser' onClick={handleCreateUserClick}>
                                <PlusIcon />
                                Crear Usuario
                            </button>
                        </div>
                    </div>
                    <div className="table">
                        <div className="table--head">
                            <div className="row">
                                <div className="cell"><p>Usuario</p></div>
                                <div className="cell">Estado</div>
                                <div className="cell"><p>Plan</p></div>
                                <div className="cell"><p>Dispositivos</p></div>
                                <div className="cell"><p>Comentario</p></div>
                                <div className="cell"><p>Acciones</p></div>
                            </div>
                        </div>
                        <div className="table--body">
                            {
                                users.map((user) => {
                                    return (
                                        <UserRow key={user._id} setUserSelected={setUserSelected} user={user} usersSessions={usersSessions} plans={plans} handleEditUserClick={handleEditUserClick} handleDownloadPlaylistClick={handleDownloadPlaylistClick} />
                                    )
                                })
                            }
                        </div>
                    </div>
                    <>
                        <div className={`modal ${showModal ? '' : 'inv'}`}>
                            {modalComponent}
                        </div>
                    </>
                </>
            )}
        </div>

    );
};

export default Users;