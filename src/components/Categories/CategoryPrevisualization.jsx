import { useEffect, useState } from "react";
import { API_FS } from "../../functions/fetchToBackEnd"
import { CloseIcon } from "../Icons"

export const CategoryPrevisualization = ({ categories, categoryId, channels }) => {

    const hidePrevisualization = () => {
        const prev = document.querySelector('.previsualization')
        const table = document.querySelector('.table')

        prev.classList.add('hidden')
        table.classList.remove('reduced')
    }

    if (categories && categoryId && channels) {

        const category = categories.find(cat => cat._id === categoryId)
        return (
            <div className="previsualization">
                <div className="data">
                    <div className="windowTitle">
                        <div className={category?.categoryStatus ? 'ok' : 'error'}>{category?.categoryStatus ? 'Activo' : 'Inactivo'}</div>
                        <div className="name">{category?.categoryName || 'Desconocido'}</div>
                        <div className="id">({category?._id || 'Desconocido'})</div>
                    </div>
                    <div className="windowData">
                        <div className="packageChannelsTable">
                            <div className="packageChannelsTable--head">
                                <div className="row">
                                    <div className="cell">Canal</div>
                                    <div className="cell">Estado</div>
                                </div>
                            </div>
                            <div className="packageChannelsTable--body">
                                {
                                    channels.map((channel) => (
                                        (channel.categoryId === category._id) &&
                                        <div className="row" key={channel?._id}>
                                            <div className="cell">{channel.streamName}</div>
                                            <div className="cell">{!channel?.disabled ? 'Activo' : 'Inactivo'}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <button title='Cerrar Modal' onClick={hidePrevisualization}><CloseIcon /></button>
            </div >
        )
    }
    return (<div className="previsualization hidden"></div>)
}
