import { useEffect, useState } from "react";
import { API_FS } from "../../functions/fetchToBackEnd"
import { CloseIcon } from "../Icons"

export const PackagePrevisualization = ({ packages, packageId, channels, categories }) => {

    const hidePrevisualization = () => {
        const prev = document.querySelector('.previsualization')
        const table = document.querySelector('.table')

        prev.classList.add('hidden')
        table.classList.remove('reduced')
    }

    if (packages && packageId && channels && categories) {
        const pack = packages.find(pack => pack._id === packageId)
        return (
            <div className="previsualization">
                <div className="data">
                    <div className="windowTitle">
                        <div className={pack?.packageStatus ? 'ok' : 'error'}>{pack?.packageStatus ? 'Activo' : 'Inactivo'}</div>
                        <div className="name">{pack?.packageName || 'Desconocido'}</div>
                        <div className="id">({pack?._id || 'Desconocido'})</div>
                    </div>
                    <div className="windowData">
                        <div className="packageChannelsTable">
                            <div className="packageChannelsTable--head">
                                <div className="row">
                                    <div className="cell">Nº</div>
                                    <div className="cell">Canal</div>
                                    <div className="cell">Estado</div>
                                    <div className="cell">Categoría</div>
                                </div>
                            </div>
                            <div className="packageChannelsTable--body">
                                {
                                    pack?.streams
                                        // .map(stream => {
                                        //     const channel = channels.find(channel => stream === channel._id);

                                        //     return <div className="row" key={stream}>
                                        //         <div className="cell">{channel?.position}</div>
                                        //         <div className="cell">{channel?.streamName}</div>
                                        //         <div className="cell">{!channel?.disabled ? 'Activo' : 'Inactivo'}</div>
                                        //         <div className="cell">{'No definido'}</div>
                                        //     </div>
                                        // })
                                        .map((stream) => {
                                            const channel = channels.find(channel => stream === channel._id);
                                            const category = categories.find(category => category._id === channel?.categoryId)?.categoryName || 'No definido'
                                            return { channel, stream, category };
                                        })
                                        .sort((a, b) => a?.channel?.position - b?.channel?.position)
                                        .map(({ channel, stream, category }) => (
                                            <div className="row" key={stream}>
                                                <div className="cell">{channel?.position}</div>
                                                <div className="cell">{channel?.streamName}</div>
                                                <div className="cell">{!channel?.disabled ? 'Activo' : 'Inactivo'}</div>
                                                <div className="cell">{category || 'No definido'}</div>
                                            </div>
                                        ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <button title='Cerrar Modal' onClick={hidePrevisualization}><CloseIcon /></button>
            </div>
        )
    }
    return (<div className="previsualization hidden"></div>)
}
