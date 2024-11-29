import React, { useRef } from 'react'
import { DeleteIcon, EditIcon, ViewIcon } from '../Icons.jsx'
import { toast } from 'react-toastify';
import { fetchDeleteCategory } from '../../functions/fetch/categories.js';

export const CategoryRow = ({ setCategorySelected, category, handleEditCategoryClick, channels }) => {
    const deleteId = useRef(null);
    const notify = (id, message) => id.current = toast(message, { autoClose: false, theme: 'light' });
    const updateFail = (id, error) => toast.update(id.current, { render: error, type: "error", autoClose: 3000 });
    const updateSuccess = (id, message) => toast.update(id.current, { render: message, type: "success", autoClose: 3000 });

    const showPrevisualization = () => {
        setCategorySelected(category._id)

        const prev = document.querySelector('.previsualization')
        const table = document.querySelector('.table')

        prev.classList.remove('hidden')
        table.classList.add('reduced')
    }

    const handleEditCategory = () => {
        showPrevisualization()
        handleEditCategoryClick(category._id)
    }

    const handleDeleteCategory = async () => {
        notify(deleteId, `Eliminando Categoría ${category.categoryName}`)
        setTimeout(async () => {
            if (confirm(`¿Estás seguro de eliminar la categoría ${category.categoryName}?`)) {
                const response = await fetchDeleteCategory(category._id)
                response.error ? updateFail(deleteId, 'No fue posible eliminar la categoría') : updateSuccess(deleteId, 'Categoría eliminada correctamente')
            } else {
                updateFail(deleteId, 'Solicitad de eliminación cancelada')
            }
        }, 1000)
    }

    return (
        <div className="row">
            <div className="cell"><p>{category?.categoryName}</p></div>
            <div className="cell"><p className={category?.categoryStatus ? 'ok' : 'error'}>{category?.categoryStatus ? 'Activo' : 'Desactivado'}</p></div>
            <div className="cell"><p>{channels && channels.filter(channel => channel.categoryId === category._id).length || '0'}</p></div>
            <div className="cell">
                <button title="Ver" onClick={showPrevisualization}>
                    <ViewIcon />
                </button>
                <button title="Editar" onClick={handleEditCategory}>
                    <EditIcon />
                </button>
                <button title="Eliminar" onClick={handleDeleteCategory}>
                    <DeleteIcon />
                </button>
            </div>
        </div>
    )
}
