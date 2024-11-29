import { useEffect, useState } from 'react';
import { EditPlan } from './Plans/modals/EditPlan';
import { fetchPlans } from '../functions/fetch/plans';
import { toast } from 'react-toastify';
import { fetchPackages } from '../functions/fetch/packages';
import { Grid } from 'react-loader-spinner';
import { PlanPrevisualization } from './Plans/PlanPrevisualization';
import { PlusIcon, SearchIcon } from './Icons';
import { CreatePlan } from './Plans/modals/CreatePlan';
import { PlanRow } from './Plans/PlanRow';

const Plans = ({ intervalDuration }) => {
    const [planSelected, setPlanSelected] = useState()
    const [plansInfo, setPlansInfo] = useState([])
    const [packages, setPackages] = useState(undefined)

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalComponent, setModalComponent] = useState(null);

    const handleEditPlanClick = (id) => {
        setModalComponent(<EditPlan plans={plansInfo} planId={id} setShowModal={setShowModal} packages={packages} />);
        setShowModal(true);
    };

    const handleCreatePlanClick = () => {
        setModalComponent(<CreatePlan setShowModal={setShowModal} packages={packages} />);
        setShowModal(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            const plansInfoFetched = await fetchPlans();
            if (plansInfoFetched) {
                if (plansInfoFetched.error) {
                    toast.error(plansInfoFetched.error);
                } else {
                    setPlansInfo(plansInfoFetched);
                    setLoading(false)
                }
            }

            const packages = await fetchPackages();
            if (packages) {
                if (packages.error) {
                    toast.error(packages.error);
                } else {
                    setPackages(packages);
                }
            }

            // const categories = await fetchCategories();
            // if (categories) {
            //     if (categories.error) {
            //         toast.error(categories.error);
            //     } else {
            //         setCategories(categories);
            //     }
            // }
        };

        // Limpiar el intervalo anterior antes de crear uno nuevo
        fetchData()
        const plansInterval = setInterval(fetchData, intervalDuration);

        // Limpieza del intervalo al desmontar el componente
        return () => {

            clearInterval(plansInterval);
        };
    }, [intervalDuration]);

    return (
        <div className="plans" onKeyDown={(e) => { e.keyCode === 27 && setShowModal(false) }}>
            {loading ? <Grid /> : (
                <>
                    <PlanPrevisualization plans={plansInfo} planId={planSelected} packages={packages} />

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
                            <button className='createPlan' onClick={handleCreatePlanClick} >
                                <PlusIcon />
                                Crear Plan
                            </button>
                        </div>
                    </div>
                    <div className="table">
                        <div className="table--head">
                            <div className="row">
                                <div className="cell"><p>Plan</p></div>
                                <div className="cell"><p>Estado</p></div>
                                <div className="cell"><p>Paquetes</p></div>
                                <div className="cell"><p>Comentario</p></div>
                                <div className="cell"><p>Acciones</p></div>
                            </div>
                        </div>
                        <div className="table--body">
                            {
                                plansInfo.map((plan) => {
                                    return (
                                        <PlanRow key={plan._id} setPlanSelected={setPlanSelected} plan={plan} handleEditPlanClick={handleEditPlanClick} />
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

export default Plans;