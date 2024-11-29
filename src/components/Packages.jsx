import { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon } from './Icons';
import { PackagePrevisualization } from './Packages/PackagePrevisualization';
import { PackageRow } from './Packages/PackageRow.jsx';
import { fetchPackages } from '../functions/fetch/packages.js';
// import { fetchCategories } from '../functions/fetch/categories.js';
import { CreatePackage } from './Packages/modals/CreatePackage.jsx';
import { Grid } from 'react-loader-spinner';
import { EditPackage } from './Packages/modals/EditPackage.jsx';
import { toast } from 'react-toastify';
import { fetchChannels } from '../functions/fetch/channels.js';
import { fetchCategories } from '../functions/fetch/categories.js';


const Packages = ({ intervalDuration }) => {

    const [packageSelected, setPackageSelected] = useState()
    const [packagesInfo, setPackagesInfo] = useState([])
    const [channels, setChannels] = useState(undefined)
    const [categories, setCategories] = useState(undefined)

    // const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalComponent, setModalComponent] = useState(null);

    const handleEditPackageClick = (id) => {
        setModalComponent(<EditPackage packages={packagesInfo} packageId={id} setShowModal={setShowModal} channels={channels} />);
        setShowModal(true);
    };

    const handleCreatePackageClick = () => {
        setModalComponent(<CreatePackage setShowModal={setShowModal} channels={channels} />);
        setShowModal(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            const packagesInfoFetched = await fetchPackages();
            if (packagesInfoFetched) {
                if (packagesInfoFetched.error) {
                    toast.error(packagesInfoFetched.error);
                } else {
                    setPackagesInfo(packagesInfoFetched);
                    setLoading(false)
                }
            }

            const channels = await fetchChannels();
            if (channels) {
                if (channels.error) {
                    toast.error(channels.error);
                } else {
                    setChannels(channels);
                }
            }

            const categories = await fetchCategories();
            if (categories) {
                if (categories.error) {
                    toast.error(categories.error);
                } else {
                    setCategories(categories);
                }
            }
        };

        // Limpiar el intervalo anterior antes de crear uno nuevo
        fetchData()
        const packagesInterval = setInterval(fetchData, intervalDuration);

        // Limpieza del intervalo al desmontar el componente
        return () => {
            clearInterval(packagesInterval);
        };
    }, [intervalDuration]);

    return (
        <div className="packages" onKeyDown={(e) => { e.keyCode === 27 && setShowModal(false) }}>
            {loading ? <Grid /> : (
                <>
                    <PackagePrevisualization packages={packagesInfo} packageId={packageSelected} channels={channels} categories={categories} />

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
                            <button className='createChannel' onClick={handleCreatePackageClick}>
                                <PlusIcon />
                                Crear Paquete
                            </button>
                        </div>
                    </div>
                    <div className="table">
                        <div className="table--head">
                            <div className="row">
                                <div className="cell"><p>Paquete</p></div>
                                <div className="cell"><p>Estado</p></div>
                                <div className="cell"><p>Canales</p></div>
                                <div className="cell"><p>Comentario</p></div>
                                <div className="cell"><p>Acciones</p></div>
                            </div>
                        </div>
                        <div className="table--body">
                            {
                                packagesInfo.map((pack) => {
                                    return (
                                        <PackageRow key={pack._id} setPackageSelected={setPackageSelected} pack={pack} handleEditPackageClick={handleEditPackageClick} />
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

export default Packages;