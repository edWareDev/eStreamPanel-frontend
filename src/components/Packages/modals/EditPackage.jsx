import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { fetchEditPackage } from '../../../functions/fetch/packages';

export const EditPackage = ({ packages, packageId, setShowModal, channels }) => {
  const toastId = useRef(null);
  const notify = () => toastId.current = toast("Editando Paquete", { autoClose: false, theme: 'light' });
  const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
  const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });

  const pack = packages.find(pack => pack._id === packageId)

  const [checkedChannels, setCheckedChannels] = useState(pack.streams);

  const [estado, setEstado] = useState(pack.packageStatus ? "1" : "0" || '')

  useEffect(() => {
    // Actualizar categoryId cuando cambia el channelId
    setCheckedChannels(pack.streams);
    setEstado(pack.packageStatus ? "1" : "0");
  }, [packageId, pack]);

  const handleCheckboxChange = (channelId) => {
    if (checkedChannels.includes(channelId)) {
      setCheckedChannels(checkedChannels.filter(id => id !== channelId));
    } else {
      setCheckedChannels([...checkedChannels, channelId]);
    }
  };
  const handleStatusChange = (e) => {
    setEstado(e.target.value);
  };


  const sendData = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const formPackageManager = event.currentTarget;
    const formData = new FormData(formPackageManager);
    formData.append('streams', JSON.stringify(checkedChannels))

    notify()
    const resultEditPackage = await fetchEditPackage(packageId, formData);
    setTimeout(() => {
      if (resultEditPackage.error) {
        updateFail(resultEditPackage.error)
      } else {
        updateSuccess("Paquete editado satisfactoriamente")
        formPackageManager.reset()
      }
    }, 1000)
  }

  const reset = () => {
    setShowModal(false)
    setCheckedChannels([])
  }

  return (
    <div className='managePackage'>
      <div className="modalTitle">
        Editar Paquete
      </div>
      <form method='post' onSubmit={sendData} onReset={reset} className='formCreateUser'>
        <div className='basicData'>
          <label htmlFor="packageName">
            <p>Nombre de Paquete:</p>
            <input type="text" name='packageName' id='packageName' autoComplete='off' required defaultValue={pack.packageName} />
          </label>

          <label htmlFor="packageStatus">
            <p>Estado:</p>
            <select name="packageStatus" title='Estado del Usuario' required value={estado} onChange={handleStatusChange}>
              <option key="activo" value="1">Activo</option>
              <option key="inactivo" value="0">Inactivo</option>
            </select>
          </label>
        </div>
        <div className='checkboxChannels'>
          <div className="checkboxContainer">
            {
              channels.map(channel => {
                return <label htmlFor={channel._id} key={channel._id}>
                  <input type="checkbox" value={channel.streamName} id={channel._id} checked={checkedChannels.includes(channel._id)} onChange={() => handleCheckboxChange(channel._id)} />
                  {channel.streamName}
                </label>
              })
            }
          </div>
        </div>
        <div className='packageComment'>
          <label htmlFor="comment">
            <p>Comentario:</p>
            <input type="text" name='comment' id='comment' autoComplete='off' defaultValue={pack.comment} />
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
