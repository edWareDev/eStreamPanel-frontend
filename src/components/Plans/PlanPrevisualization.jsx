import { useEffect, useState } from "react";
import { API_FS } from "../../functions/fetchToBackEnd"
import { CloseIcon } from "../Icons"

export const PlanPrevisualization = ({ plans, planId, packages }) => {

    const hidePrevisualization = () => {
        const prev = document.querySelector('.previsualization')
        const table = document.querySelector('.table')

        prev.classList.add('hidden')
        table.classList.remove('reduced')
    }

    if (plans && planId && packages) {

        const plan = plans.find(plan => plan._id === planId)
        return (
            <div className="previsualization">
                <div className="data">
                    <div className="windowTitle">
                        <div className={plan?.planStatus ? 'ok' : 'error'}>{plan?.planStatus ? 'Activo' : 'Inactivo'}</div>
                        <div className="name">{plan?.planName || 'Desconocido'}</div>
                        <div className="id">({plan?._id || 'Desconocido'})</div>
                    </div>
                    <div className="windowData">
                        <div className="packageChannelsTable">
                            <div className="packageChannelsTable--head">
                                <div className="row">
                                    <div className="cell">Paquete</div>
                                    <div className="cell">Estado</div>
                                </div>
                            </div>
                            <div className="packageChannelsTable--body">
                                {
                                    plan?.packages
                                        .map((pack) => {
                                            const packAge = packages.find(packk => pack === packk._id);
                                            return { packAge, pack };
                                        })
                                        .map(({ packAge, pack }) => (
                                            <div className="row" key={pack}>
                                                <div className="cell">{packAge?.packageName}</div>
                                                <div className="cell">{!packAge?.disabled ? 'Activo' : 'Inactivo'}</div>
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
