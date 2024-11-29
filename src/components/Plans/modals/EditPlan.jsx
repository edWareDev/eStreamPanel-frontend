import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { fetchEditPlan } from '../../../functions/fetch/plans';
// import { fetchEditPackage } from '../../../functions/fetch/packages';

export const EditPlan = ({ plans, planId, setShowModal, packages }) => {
  const toastId = useRef(null);
  const notify = () => toastId.current = toast("Editando Plan", { autoClose: false, theme: 'light' });
  const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
  const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });

  const plan = plans.find(plan => plan._id === planId)

  const [checkedPackages, setCheckedPackages] = useState(plan.packages);

  const [estado, setEstado] = useState(plan.planStatus ? "1" : "0" || '')

  useEffect(() => {
    // Actualizar categoryId cuando cambia el channelId
    setCheckedPackages(plan.packages);
    setEstado(plan.planStatus ? "1" : "0");
  }, [planId, plan]);

  const handleCheckboxChange = (packageId) => {
    if (checkedPackages.includes(packageId)) {
      setCheckedPackages(checkedPackages.filter(id => id !== packageId));
    } else {
      setCheckedPackages([...checkedPackages, packageId]);
    }
  };
  const handleStatusChange = (e) => {
    setEstado(e.target.value);
  };


  const sendData = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const formPlanManager = event.currentTarget;
    const formData = new FormData(formPlanManager);
    formData.append('packages', JSON.stringify(checkedPackages))

    notify()
    const resultEditPlan = await fetchEditPlan(planId, formData);
    setTimeout(() => {
      if (resultEditPlan.error) {
        updateFail(resultEditPlan.error)
      } else {
        updateSuccess("Plan editado satisfactoriamente")
        formPlanManager.reset()
      }
    }, 1000)
  }

  const reset = () => {
    setShowModal(false)
    setCheckedPackages([])
  }

  return (
    <div className='managePlan'>
      <div className="modalTitle">
        Editar Plan
      </div>
      <form method='post' onSubmit={sendData} onReset={reset} className='formEditPlan'>
        <div className='basicData'>
          <label htmlFor="planName">
            <p>Nombre de Plan:</p>
            <input type="text" name='planName' id='planName' autoComplete='off' required defaultValue={plan.planName} />
          </label>

          <label htmlFor="planStatus">
            <p>Estado:</p>
            <select name="planStatus" title='Estado del Plan' required value={estado} onChange={handleStatusChange}>
              <option key="activo" value="1">Activo</option>
              <option key="inactivo" value="0">Inactivo</option>
            </select>
          </label>
        </div>
        <div className='checkboxPlans'>
          <div className="checkboxContainer">
            {
              packages.map(pack => {
                return <label htmlFor={pack._id} key={pack._id}>
                  <input type="checkbox" value={pack.packageName} id={pack._id} checked={checkedPackages.includes(pack._id)} onChange={() => handleCheckboxChange(pack._id)} />
                  {pack.packageName}
                </label>
              })
            }
          </div>
        </div>
        <div className='planComment'>
          <label htmlFor="comment">
            <p>Comentario:</p>
            <input type="text" name='comment' id='comment' autoComplete='off' defaultValue={plan.comment} />
          </label>
        </div>
        <div className='buttons'>
          <button type='submit' >Guardar</button>
          <button type='reset' >Cancelar</button>
        </div>
      </form>
    </div>
  )
}
