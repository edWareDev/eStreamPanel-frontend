import { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon } from './Icons';
import { ChannelPrevisualization } from './Channels/ChannelPrevisualization';
import { ChannelRow } from './Channels/ChannelRow';
import { fetchChannels } from '../functions/fetch/channels.js';
import { fetchCategories } from '../functions/fetch/categories.js';
import { CreateChannel } from './Channels/modals/CreateChannel';
import { Grid } from 'react-loader-spinner';
import { EditChannel } from './Channels/modals/EditChannel';
import { toast } from 'react-toastify';

const Channels = ({ usersSessions, intervalDuration }) => {

    const [channelSelected, setChannelSelected] = useState()
    const [channelsInfo, setChannelsInfo] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalComponent, setModalComponent] = useState(null);

    const handleEditChannelClick = (id) => {
        setModalComponent(<EditChannel categories={categories} channels={channelsInfo} channelId={id} setShowModal={setShowModal} />);
        setShowModal(true);
    };

    const handleCreateChannelClick = () => {
        setModalComponent(<CreateChannel categories={categories} setShowModal={setShowModal} />);
        setShowModal(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            const channelsInfoFetched = await fetchChannels();
            if (channelsInfoFetched) {
                if (channelsInfoFetched.error) {
                    toast.error(channelsInfoFetched.error);
                } else {
                    setChannelsInfo(channelsInfoFetched);
                    setLoading(false)
                }
            }

            const categoriesFetched = await fetchCategories();
            if (categoriesFetched) {
                if (categoriesFetched.error) {
                    toast.error(categoriesFetched.error);
                } else {
                    setCategories(categoriesFetched);
                }
            }
        };

        // Limpiar el intervalo anterior antes de crear uno nuevo
        fetchData()
        const channelsInterval = setInterval(fetchData, intervalDuration);

        // Limpieza del intervalo al desmontar el componente
        return () => {
            clearInterval(channelsInterval);
        };
    }, [intervalDuration]);

    return (
        <div className="channels" onKeyDown={(e) => { e.keyCode === 27 && setShowModal(false) }}>
            {loading ? <Grid /> : (
                <>
                    <ChannelPrevisualization channels={channelsInfo} channelId={channelSelected} />

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
                            <button className='createChannel' onClick={handleCreateChannelClick}>
                                <PlusIcon />
                                Crear Canal
                            </button>
                        </div>
                    </div>
                    <div className="table">
                        <div className="table--head">
                            <div className="row">
                                <div className="cell"><p>Nº</p></div>
                                <div className="cell">Logo</div>
                                <div className="cell"><p>Nombre</p></div>
                                <div className="cell"><p>Estado</p></div>
                                <div className="cell"><p>Categoría</p></div>
                                <div className="cell"><p>Bitrate</p></div>
                                <div className="cell"><p>Ancho de Banda I/O</p></div>
                                <div className="cell"><p>Clientes</p></div>
                                <div className="cell"><p>Acciones</p></div>
                            </div>
                        </div>
                        <div className="table--body">
                            {
                                channelsInfo.map((channel) => {
                                    return (
                                        <ChannelRow key={channel.name} setChannelSelected={setChannelSelected} channel={channel} usersSessions={usersSessions} categories={categories} handleEditChannelClick={handleEditChannelClick} />
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

export default Channels;