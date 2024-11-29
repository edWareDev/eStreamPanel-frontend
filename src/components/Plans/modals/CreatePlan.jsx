import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';

import { fetchCreatePlan } from '../../../functions/fetch/plans';

export const CreatePlan = ({ packages, setShowModal }) => {
  const toastId = useRef(null);
  const [checkedPackages, setCheckedPackages] = useState([]);
  const notify = () => toastId.current = toast("Creando Plan", { autoClose: false, theme: 'light' });
  const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
  const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });

  const handleCheckboxChange = (packageId) => {
    if (checkedPackages.includes(packageId)) {
      setCheckedPackages(checkedPackages.filter(id => id !== packageId));
    } else {
      setCheckedPackages([...checkedPackages, packageId]);
    }
  };
  const sendData = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const formPackageManager = event.currentTarget;
    const formData = new FormData(formPackageManager);
    formData.append('streams', JSON.stringify(checkedPackages))

    notify()
    const resultCreatePlan = await fetchCreatePlan(formData);
    setTimeout(() => {
      if (resultCreatePlan.error) {
        updateFail(resultCreatePlan.error)
      } else {
        updateSuccess("Plan creado satisfactoriamente")
        formPackageManager.reset()
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
        Crear Plan
      </div>
      <form method='post' onSubmit={sendData} onReset={reset} className='formCreatePlan'>
        <div className='basicData'>
          <label htmlFor="planName">
            <p>Nombre de Plan:</p>
            <input type="text" name='planName' id='planName' autoComplete='off' required />
          </label>

          <label htmlFor="planStatus">
            <p>Estado:</p>
            <select name="planStatus" title='Estado del Plan' required>
              <option key="activo" value={true}>Activo</option>
              <option key="inactivo" value={false}>Inactivo</option>
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
            <input type="text" name='comment' id='comment' autoComplete='off' />
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
