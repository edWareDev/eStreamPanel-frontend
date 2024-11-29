import { useEffect, useRef, useState } from 'react'
import { fetchEditChannel } from '../../../functions/fetch/channels.js';
import { toast } from 'react-toastify';

export const EditChannel = ({ categories, channels, channelId, setShowModal }) => {
    const toastId = useRef(null);
    const notify = () => toastId.current = toast("Editando Canal", { autoClose: false, theme: 'light', position: "bottom-right" });
    const updateFail = (error) => toast.update(toastId.current, { render: error, type: "error", autoClose: 3000 });
    const updateSuccess = (message) => toast.update(toastId.current, { render: message, type: "success", autoClose: 3000 });



    const channel = channels.find(channel => channel._id === channelId)

    const [categoryId, setCategoryId] = useState(channel.categoryId || '')

    useEffect(() => {
        setCategoryId(channel.categoryId || '');
    }, [channelId, channel.categoryId]);

    const handleCategoryChange = (e) => {
        setCategoryId(e.target.value);
    };

    const updateImagePreview = (e) => {
        const formChannelManager = document.querySelector('.formEditChannel');
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
        const resultEditChannel = await fetchEditChannel(channelId, formData);
        // const resultCreateChannel = { error: 'No fue posible editar el canal' };
        setTimeout(() => {
            if (resultEditChannel.error) {
                updateFail(resultEditChannel.error)
            } else {
                updateSuccess("Canal Modificado Correctamente")
                formChannelManager.reset()
                setShowModal(false)
            }
        }, 500)

    }

    const reset = () => {
        setShowModal(false)
    }


    return (
        <div className='manageChannel'>
            <div className="modalTitle">
                Editar Canal
            </div>
            <form method='post' onSubmit={sendData} onReset={reset} className='formEditChannel'>
                <div>
                    <label htmlFor="streamName">
                        <p>Nombre del Canal:</p>
                        <input type="text" name='streamName' id='streamName' autoComplete='off' required defaultValue={channel?.streamName || 'Desconocido'} />
                    </label>

                    <label htmlFor="url">
                        <p>Url de Reproducción:</p>
                        <input type="url" name='url' id='url' autoComplete='off' required defaultValue={channel?.config_on_disk.inputs[0]?.url || 'Desconocido'} />
                    </label>

                    <label htmlFor="position">
                        <p>Posición del Canal:</p>
                        <input type="number" min="1" name='position' id='position' autoComplete='off' required defaultValue={channel?.position || 'Desconocido'} />
                    </label>

                    <label htmlFor="categoryId">
                        <p>Categoría del Canal:</p>
                        <select name="categoryId" title='Categoría' required value={categoryId || ''} onChange={handleCategoryChange}>
                            {
                                categories.map(categoria => (
                                    <option key={categoria._id} value={categoria._id}>
                                        {categoria.categoryName}
                                    </option>
                                ))
                            }
                            <option value=''>No definido</option>
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
                            src={channel.logoUrl}
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
