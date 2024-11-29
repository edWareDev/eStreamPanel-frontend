import React, { useRef } from 'react'
import { DeleteIcon, EditIcon, ViewIcon } from '../Icons.jsx'
import { toast } from 'react-toastify';
import { fetchDeletePlan } from '../../functions/fetch/plans.js';

export const PlanRow = ({ setPlanSelected, plan, handleEditPlanClick }) => {
    const deleteId = useRef(null);
    const notify = (id, message) => id.current = toast(message, { autoClose: false, theme: 'light' });
    const updateFail = (id, error) => toast.update(id.current, { render: error, type: "error", autoClose: 3000 });
    const updateSuccess = (id, message) => toast.update(id.current, { render: message, type: "success", autoClose: 3000 });

    const showPrevisualization = () => {
        setPlanSelected(plan._id)

        const prev = document.querySelector('.previsualization')
        const table = document.querySelector('.table')

        prev.classList.remove('hidden')
        table.classList.add('reduced')
    }

    const handleEditPlan = () => {
        showPrevisualization()
        handleEditPlanClick(plan._id)
    }

    const handleDeletePlan = async () => {
        notify(deleteId, `Eliminando Plan ${plan.planName}`)
        setTimeout(async () => {
            if (confirm(`¿Estás seguro de eliminar el plan ${plan.planName}?`)) {
                const response = await fetchDeletePlan(plan._id)
                response.error ? updateFail(deleteId, 'No fue posible eliminar el plan') : updateSuccess(deleteId, 'Plan eliminado correctamente')
            } else {
                updateFail(deleteId, 'Solicitad de eliminación cancelada')
            }
        }, 1000)

    }

    return (
        <div className="row">
            <div className="cell"><p>{plan.planName}</p></div>
            <div className="cell"><p className={plan.planStatus ? 'ok' : 'error'}>{plan.planStatus ? 'Activo' : 'Desactivado'}</p></div>
            <div className="cell"><p>{plan.packages.length}</p></div>
            <div className="cell"><p>{plan.comment}</p></div>
            <div className="cell">
                <button title="Ver" onClick={showPrevisualization}>
                    <ViewIcon />
                </button>
                <button title="Editar" onClick={handleEditPlan}>
                    <EditIcon />
                </button>
                <button title="Eliminar" onClick={handleDeletePlan}>
                    <DeleteIcon />
                </button>
            </div>
        </div>
    )
}
