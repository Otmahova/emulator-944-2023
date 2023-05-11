import { useContext, useEffect, useState } from "react"

import { IParam } from "../../types"
import { AppContext } from "../../App"
import './style.css'

export const ParamCard = ({ param }: { param: IParam }) => {
    const [value, setValue] = useState(param.value)
    const [isOperative, setIsOperative] = useState(false)
    const { params, setParams } = useContext(AppContext)
    useEffect(() => {
        const paramId = params.findIndex(i => i.id === param.id)
        if (paramId === -1) return
        const newParams = Array.from(params)
        newParams[paramId] = {
            ...newParams[paramId],
            value,
            isOperative
        }
        setParams(newParams)
    }, [value, isOperative])

    return <div className={'paramCard'}>
        <h2 className={'paramCardLabel'}>{param.name + ' ' + param.metric}</h2>
        <input className={'paramCardInput'} value={value} onChange={e => setValue(e.target.value)} type="text" />
        <button className={'paramCardBtn'} onClick={() => setIsOperative(!isOperative)}>{isOperative ? '1' : '0'}</button>
    </div>
}