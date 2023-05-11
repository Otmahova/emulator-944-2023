import { createContext, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import axios from 'axios'

import { SERVER_URL } from "./config"
import { IParam } from "./types"
import { ParamCard } from "./components"
import './styles/index.css'

export const AppContext = createContext<{
    params: IParam[],
    setParams: Dispatch<SetStateAction<IParam[]>>
}>({
    params: [],
    setParams: () => {}
})

export const App: FC = () => {
    const [params, setParams] = useState<IParam[]>([])
    const [loading, setLoading] = useState(false)

    const [syncIteration, setSyncIteration] = useState(0)
    useEffect(() => {
        setLoading(true)
        axios.get(`${SERVER_URL}/params`)
            .then(response => {
                const { data } = response.data as { data: IParam[], msg: string }
                setParams(data)
            })
            .finally(() => setLoading(false))
    }, [syncIteration])

    const readVars = async () => {
        setLoading(true)
        axios.post(`${SERVER_URL}/params/sync`)
            .then((response) => {
                const params = response.data.data as IParam[]
                setParams(params)
                setLoading(false)
            })
    }
    const writeVars = async () => {
        axios.put(`${SERVER_URL}/params`, { params })
            .then(() => {
                alert('Загружены в устройство')
            })
            .catch(() => {
                alert('Ошибка загрузки данных')
            })
    }
    console.log(params)
    return <AppContext.Provider value={{
        params,
        setParams
    }}>
        <div className={'container'}>
            <header className={'container'}>
                <h1>Список параметров</h1>
                <div>
                    <button onClick={readVars}>считать</button>
                    <button onClick={writeVars}>записать</button>
                </div>
            </header>
        </div>
        { loading ? <div className={'container'} style={{ paddingTop: '46%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            <h2 style={{ fontSize: '1.2rem', opacity: .5 }}>Загружаем</h2>
        </div> : <main className={'container'}>
            { params?.sort((a, b) => a.uuid > b.uuid ? 1 : a.uuid === b.uuid ? 0 : -1)?.map(param => {
                return <ParamCard key={param.id} param={param} />
            }) }
        </main> }

    </AppContext.Provider>
}

