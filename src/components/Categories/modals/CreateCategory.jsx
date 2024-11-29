import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';

import { fetchCreateCategory } from '../../../functions/fetch/categories';

export const CreateCategory = ({ channels, setShowModal }) => {
  const toastId = useRef(null);

  const notify = () => toastId.current = toast("Creando Categoría", { autoClose: false, theme: 'light' });
  const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
  const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });

  const sendData = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const formCategoryManager = event.currentTarget;
    const formData = new FormData(formCategoryManager);

    notify()
    const resultCreateCategory = await fetchCreateCategory(formData);
    setTimeout(() => {
      if (resultCreateCategory.error) {
        updateFail(resultCreateCategory.error)
      } else {
        updateSuccess("Categoría creado satisfactoriamente")
        formCategoryManager.reset()
      }
    }, 1000)

  }

  const reset = () => {
    setShowModal(false)
  }

  return (
    <div className='manageCategory'>
      <div className="modalTitle">
        Crear Categoría
      </div>
      <form method='post' onSubmit={sendData} onReset={reset} className='formCreatePlan'>
        <div className='basicData'>
          <label htmlFor="categoryName">
            <p>Nombre de Categoría:</p>
            <input type="text" name='categoryName' id='categoryName' autoComplete='off' required />
          </label>

          <label htmlFor="categoryStatus">
            <p>Estado:</p>
            <select name="categoryStatus" title='Estado de categoría' required>
              <option key="activo" value={true}>Activo</option>
              <option key="inactivo" value={false}>Inactivo</option>
            </select>
          </label>
        </div>
        <div className='buttons'>
          <button type='submit'>Guardar</button>
          <button type='reset'>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
