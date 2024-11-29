import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { fetchEditCategory } from '../../../functions/fetch/categories';

export const EditCategory = ({ categories, categoryId, setShowModal, channels }) => {
  const toastId = useRef(null);
  const notify = () => toastId.current = toast("Editando Plan", { autoClose: false, theme: 'light' });
  const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
  const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });

  const category = categories.find(category => category._id === categoryId)

  const [estado, setEstado] = useState(category.categoryStatus ? "1" : "0" || '')

  useEffect(() => {
    // Actualizar categoryId cuando cambia el channelId
    setEstado(category?.categoryStatus ? "1" : "0");
  }, [categoryId, category]);


  const handleStatusChange = (e) => {
    setEstado(e.target.value);
  };


  const sendData = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const formPlanManager = event.currentTarget;
    const formData = new FormData(formPlanManager);

    notify()
    const resultEditCategory = await fetchEditCategory(categoryId, formData);
    setTimeout(() => {
      if (resultEditCategory.error) {
        updateFail(resultEditCategory.error)
      } else {
        updateSuccess("Categoría editado satisfactoriamente")
        formPlanManager.reset()
      }
    }, 1000)
  }

  const reset = () => {
    setShowModal(false)
  }

  return (
    <div className='manageCategory'>
      <div className="modalTitle">
        Editar Categoria
      </div>
      <form method='post' onSubmit={sendData} onReset={reset} className='formEditPlan'>
        <div className='basicData'>
          <label htmlFor="categoryName">
            <p>Nombre de categoría:</p>
            <input type="text" name='categoryName' id='categoryName' autoComplete='off' required defaultValue={category.categoryName} />
          </label>

          <label htmlFor="categoryStatus">
            <p>Estado:</p>
            <select name="categoryStatus" title='Estado de categoría' required value={estado} onChange={handleStatusChange}>
              <option key="activo" value="1">Activo</option>
              <option key="inactivo" value="0">Inactivo</option>
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
