import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';

import { fetchCreatePackage } from '../../../functions/fetch/packages';

export const CreatePackage = ({ channels, setShowModal }) => {
  const toastId = useRef(null);
  const [checkedChannels, setCheckedChannels] = useState([]);
  const notify = () => toastId.current = toast("Creando Paquete", { autoClose: false, theme: 'light' });
  const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
  const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });

  const handleCheckboxChange = (channelId) => {
    if (checkedChannels.includes(channelId)) {
      setCheckedChannels(checkedChannels.filter(id => id !== channelId));
    } else {
      setCheckedChannels([...checkedChannels, channelId]);
    }
  };


  const sendData = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const formPackageManager = event.currentTarget;
    const formData = new FormData(formPackageManager);
    formData.append('streams', JSON.stringify(checkedChannels))

    notify()
    const resultCreatePackage = await fetchCreatePackage(formData);
    setTimeout(() => {
      if (resultCreatePackage.error) {
        updateFail(resultCreatePackage.error)
      } else {
        updateSuccess("Paquete creado satisfactoriamente")
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
        Crear Paquete
      </div>
      <form method='post' onSubmit={sendData} onReset={reset} className='formCreateUser'>
        <div className='basicData'>
          <label htmlFor="packageName">
            <p>Nombre de Paquete:</p>
            <input type="text" name='packageName' id='packageName' autoComplete='off' required />
          </label>

          <label htmlFor="packageStatus">
            <p>Estado:</p>
            <select name="packageStatus" title='Estado del Usuario' required>
              <option key="activo" value={true}>Activo</option>
              <option key="inactivo" value={false}>Inactivo</option>
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
