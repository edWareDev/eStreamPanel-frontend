import { useEffect, useState } from 'react';
import { EditCategory } from './Categories/modals/EditCategory';
import { CreateCategory } from './Categories/modals/CreateCategory';
import { fetchCategories } from './../functions/fetch/categories';
import { toast } from 'react-toastify';
import { fetchChannels } from './../functions/fetch/channels';
import { Grid } from 'react-loader-spinner';
import { CategoryPrevisualization } from './Categories/CategoryPrevisualization';
import { PlusIcon, SearchIcon } from './Icons';
import { CategoryRow } from './Categories/CategoryRow';

let categoriesIntervalId = 0;

const Categories = ({ intervalDuration }) => {
    const [categorySelected, setCategorySelected] = useState()
    const [categoriesInfo, setCategoriesInfo] = useState([])
    const [channels, setPackages] = useState(undefined)

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalComponent, setModalComponent] = useState(null);

    const handleEditCategoryClick = (id) => {
        setModalComponent(<EditCategory categories={categoriesInfo} categoryId={id} setShowModal={setShowModal} channels={channels} />);
        setShowModal(true);
    };

    const handleCreateCategoryClick = () => {
        setModalComponent(<CreateCategory setShowModal={setShowModal} channels={channels} />);
        setShowModal(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            const categoriesInfoFetched = await fetchCategories();
            if (categoriesInfoFetched) {
                if (categoriesInfoFetched.error) {
                    toast.error(categoriesInfoFetched.error);
                } else {
                    setCategoriesInfo(categoriesInfoFetched);
                    setLoading(false)
                }
            }

            const channels = await fetchChannels();
            if (channels) {
                if (channels.error) {
                    toast.error(channels.error);
                } else {
                    setPackages(channels);
                }
            }
        };

        // Limpiar el intervalo anterior antes de crear uno nuevo
        fetchData()
        const categoriesInterval = setInterval(fetchData, intervalDuration);

        // Limpieza del intervalo al desmontar el componente
        return () => {
            clearInterval(categoriesInterval);
        };
    }, [intervalDuration]);

    return (
        <div className="categories" onKeyDown={(e) => { e.keyCode === 27 && setShowModal(false) }}>
            {loading ? <Grid /> : (
                <>
                    <CategoryPrevisualization categories={categoriesInfo} categoryId={categorySelected} channels={channels} />

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
                            <button className='createPlan' onClick={handleCreateCategoryClick} >
                                <PlusIcon />
                                Crear Categoría
                            </button>
                        </div>
                    </div>
                    <div className="table">
                        <div className="table--head">
                            <div className="row">
                                <div className="cell"><p>Categoría</p></div>
                                <div className="cell"><p>Estado</p></div>
                                <div className="cell"><p>Canales</p></div>
                                <div className="cell"><p>Acciones</p></div>
                            </div>
                        </div>
                        <div className="table--body">
                            {
                                categoriesInfo.map((cat) => {
                                    return (
                                        <CategoryRow key={cat._id} setCategorySelected={setCategorySelected} category={cat} handleEditCategoryClick={handleEditCategoryClick} channels={channels} />
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

export default Categories;