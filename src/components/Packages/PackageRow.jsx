import React, { useRef } from 'react'
import { DeleteIcon, EditIcon, ViewIcon } from '../Icons'
import { toast } from 'react-toastify';
import { fetchDeletePackage } from '../../functions/fetch/packages.js';

export const PackageRow = ({ setPackageSelected, pack, handleEditPackageClick }) => {
    const deleteId = useRef(null);
    const notify = (id, message) => id.current = toast(message, { autoClose: false, theme: 'light' });
    const updateFail = (id, error) => toast.update(id.current, { render: error, type: "error", autoClose: 3000 });
    const updateSuccess = (id, message) => toast.update(id.current, { render: message, type: "success", autoClose: 3000 });

    const showPrevisualization = () => {
        setPackageSelected(pack._id)

        const prev = document.querySelector('.previsualization')
        const table = document.querySelector('.table')

        prev.classList.remove('hidden')
        table.classList.add('reduced')
    }

    const handleEditPackage = () => {
        showPrevisualization()
        handleEditPackageClick(pack._id)
    }

    const handleDeletePackage = async () => {
        notify(deleteId, `Eliminando Paquete ${pack.packageName}`)
        setTimeout(async () => {
            if (confirm(`¿Estás seguro de eliminar el paquete ${pack.packageName}?`)) {
                const response = await fetchDeletePackage(pack._id)
                response.error ? updateFail(deleteId, 'No fue posible eliminar el paquete') : updateSuccess(deleteId, 'Paquete eliminado correctamente')
            } else {
                updateFail(deleteId, 'Solicitad de eliminación cancelada')
            }
        }, 1000)

    }

    return (
        <div className="row">
            <div className="cell"><p>{pack.packageName}</p></div>
            <div className="cell"><p className={pack.packageStatus ? 'ok' : 'error'}>{pack.packageStatus ? 'Activo' : 'Desactivado'}</p></div>
            <div className="cell"><p>{pack.streams.length}</p></div>
            <div className="cell"><p>{pack.comment}</p></div>
            <div className="cell">
                <button title="Ver" onClick={showPrevisualization}>
                    <ViewIcon />
                </button>
                <button title="Editar" onClick={handleEditPackage}>
                    <EditIcon />
                </button>
                <button title="Eliminar" onClick={handleDeletePackage}>
                    <DeleteIcon />
                </button>
            </div>
        </div>
    )
}
