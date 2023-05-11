import { Socket } from "net"
require('dotenv').config()

import { DBService, M4Service } from "./services"
import { HOST, PORT } from "./config"
import { IFncType } from "./types";
import { udp } from "./udp";


export const tcp = new Socket()
const m4Service = new M4Service(tcp, udp)
const dbService = new DBService()


tcp.on('ready', async () => {
    m4Service.initialize()
        .then(() => console.log('>>> tcp connected successfully'))
        .catch(console.error)
})
tcp.on('data', data => {
    console.log('>>> recived tcp data', data)
    const parsedData = m4Service.parseMessage(data)
    switch (parsedData.fncByte) {
        case IFncType.READ: {
            Object.keys(parsedData.dataChains).map(async (chainKey, idx) => {
                await dbService.syncParam({
                    where: { uuid: idx + 9 },
                    data: {
                        uuid: idx + 9,
                        value: parsedData.dataChains[chainKey],
                        isOperative: false,
                    }
                })
            })
            break
        }
    }
})

tcp.on('end', () => {
    console.log('>>> tcp connection closed')
    setTimeout(() => {
        tcp.destroy()
        tcp.connect({
            host: HOST,
            port: PORT
        })
    }, 3000)
})
tcp.on('error', (err: { code: string }) => {
    if (err.code === 'ECONNREFUSED') {
        console.log('>>> tcp reconnection errored')
        setTimeout(() => {
            tcp.destroy()
            tcp.connect({
                host: HOST,
                port: PORT
            })
        }, 3000)
    }
})

tcp.connect({
    host: HOST,
    port: PORT
})