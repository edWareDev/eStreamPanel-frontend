import React, { useRef } from 'react'
import { fetchCreateChannel } from '../../../functions/fetch/channels.js';
import { toast } from 'react-toastify';

export const CreateChannel = ({ categories, setShowModal }) => {
    const toastId = useRef(null);
    const notify = () => toastId.current = toast("Creando Canal", { autoClose: false, theme: 'light' });
    const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
    const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });


    const updateImagePreview = (e) => {
        const formChannelManager = document.querySelector('.formCreateChannel');
        const previewLogo = formChannelManager.querySelector('#preview');
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = function () {
            previewLogo.src = reader.result;
        }
        if (file) {
            reader.readAsDataURL(file);
        } else {
            previewLogo.src = '../../../../../assets/images/white.jpg';
        }
    }

    const sendData = async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const formChannelManager = event.currentTarget;
        const formData = new FormData(formChannelManager);

        notify()
        const resultCreateChannel = await fetchCreateChannel(formData);
        setTimeout(() => {
            if (resultCreateChannel.error) {
                updateFail(resultCreateChannel.error)
            } else {
                updateSuccess("Canal Creado Satisfactoriamente")
                formChannelManager.reset()
            }
        }, 1000)

    }

    const reset = () => {
        setShowModal(false)
    }

    return (
        <div className='manageChannel'>
            <div className="modalTitle">
                Crear Canal
            </div>
            <form method='post' onSubmit={sendData} onReset={reset} className='formCreateChannel'>
                <div>
                    <label htmlFor="streamName">
                        <p>Nombre del Canal:</p>
                        <input type="text" name='streamName' id='streamName' autoComplete='off' required />
                    </label>

                    <label htmlFor="url">
                        <p>Url de Reproducción:</p>
                        <input type="url" name='url' id='url' autoComplete='off' required />
                    </label>

                    <label htmlFor="position">
                        <p>Posición del Canal:</p>
                        <input type="number" min="1" name='position' id='position' autoComplete='off' required />
                    </label>

                    <label htmlFor="categoryId">
                        <p>Categoría del Canal:</p>
                        <select name="categoryId" title='Categoría' required>
                            {
                                categories.map(categoria => <option key={categoria._id} value={categoria._id}>{categoria.categoryName}</option>)
                            }
                        </select>
                    </label>
                </div>
                <div>
                    <label htmlFor="logo">
                        Seleccionar
                        <input type="file" name="logo" id="logo" onChange={updateImagePreview} />
                    </label>
                    <div className="previewImgContainer">
                        <img id="preview"
                            src="../../../../../assets/images/white.jpg"
                            alt="Image Preview" />
                    </div>
                </div>
                <div >
                    <button type='submit' >Guardar</button>
                    <button type='reset' >Cancelar</button>
                </div>
            </form>
        </div>
    )
}
