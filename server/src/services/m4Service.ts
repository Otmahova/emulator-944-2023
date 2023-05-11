import { Socket as TCPSocket } from "net"
import { Socket as UDPSocket } from 'dgram'

import { IAtrType, IFncType, IParam } from "../types"
import { calcCRC, hexToString } from "../utils"
import { atrTypeDictionary } from "../data"
import { EXPECTED_IDS, HOST, PORT } from "../config";

type ILongMessage = {
    id: number,
    fnc: IFncType,
    data: number[][]
}

export class M4Service {
    private readonly _timeout: number
    private readonly isTCP = process.env.TCP === "1"
    private readonly _tcp: TCPSocket
    private readonly _udp: UDPSocket
    private readonly channel = 0
    constructor(tcpSocket: TCPSocket, udpSocket: UDPSocket, timeout = 3000) {
        this._timeout = timeout
        this._tcp = tcpSocket
        this._udp = udpSocket
    }

    private send = (msg: Buffer, cb?: (err: Error) => void) => {
        if (!this.isTCP) {
            return this._udp.send(msg, PORT, HOST, cb)
        }
        return this._tcp.write(msg, cb)
    }
    sendMessage = (msg: ILongMessage, cb?: (err: Error) => void) => {
        let payload: number[] = []
        msg.data.forEach(chain => {
            chain.forEach(byte => {
                payload.push(byte)
            })
        })

        const bodyLength = (1 + payload.length).toString(16)
        let dl1 = 0, dl2 = 0
        if (bodyLength.length === 2 || bodyLength.length === 1) {
            dl1 = parseInt(bodyLength, 16)
        } else if (bodyLength.length === 3) {
            dl1 = parseInt(bodyLength[0], 16)
            dl2 = parseInt(bodyLength.slice(1), 16)
        } else if (bodyLength.length === 4) {
            dl1 = parseInt(bodyLength.slice(0, 2), 16)
            dl2 = parseInt(bodyLength.slice(3), 16)
        }

        const crc = calcCRC(Buffer.from([
            0xFF, // NT
            0x90, // FRM
            msg.id, // ID
            0x00, // ATR
            dl1,
            dl2,
            msg.fnc,
            ...payload,
        ])).toString(16)
        const crc1 = parseInt(crc.slice(0, 2), 16)
        const crc2 = parseInt(crc.slice(2), 16)

        const data = Buffer.from([
            0x10, // SOH
            0xFF, // NT
            0x90, // FRM
            msg.id, // ID
            0x00, // ATR,
            dl1,
            dl2,
            msg.fnc,
            ...payload,
            crc1,
            crc2
        ])
        console.log(`>>> send ${process.env.TCP === '1' ? 'tcp' : 'udp'} data = `, data)
        return this.send(data, cb)
    }

    parseMessage = (msg: Buffer) => {
         const msgBytes = msg.map(i => +i)
         let payloadBytes: Uint8Array = msgBytes.slice(2, -2)
         let fncByte: number = payloadBytes[0]
         if (msgBytes[2] === 0x90) {
             payloadBytes = msgBytes.slice(7, -2)
             fncByte = payloadBytes[0]
         }
         let dataBytes = payloadBytes.slice(1)

         const chainsHash: { [key: string]: string } = {}
         let id = 0
         while (id < dataBytes.length) {
             const byte = dataBytes[id]
             const isHeadByte = !!atrTypeDictionary[byte]
             if (isHeadByte && dataBytes[id + 1]) {
                 const chainLength = +dataBytes[id + 1]
                 const data = dataBytes.slice(id + 2, id + 1 + chainLength + 1)
                 let dataString = ''
                 data.forEach(dataItem => dataString += dataItem.toString(16))
                 chainsHash[byte.toString(16) + '-' + id] = hexToString(dataString)
                 id = id + 1 + chainLength + 1
             }
         }

         return {
             dataChains: chainsHash,
             fncByte: fncByte,
         }
    }


    initialize = async () => {
        const initialMsg = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])
        this.send(initialMsg)
        setTimeout(() => {
            const startMsg = Buffer.from([0x10, 0xFF, 0x3F, 0x00, 0x00, 0x00, 0x00, 0xC1, 0x16])
            this.send(startMsg)
        }, this._timeout)
    }
    getParams = async (msgId: number, paramIds: number[]) => {
        return this.sendMessage({
            id: msgId,
            fnc: IFncType.READ,
            data: [
                ...paramIds.map(id => {
                    return [IAtrType.PARAM_NUM, 3, this.channel, id, 0]
                })
            ]
        })
    }
    setParams = async (msgId: number, params: IParam[]) => {
        return this.sendMessage({
            id: msgId,
            fnc: IFncType.WRITE,
            data: [
                ...params.filter(i => EXPECTED_IDS.includes(i.uuid)).map(param => {
                    const bufferedValue = Buffer.from(param.value)
                    return [
                        IAtrType.PARAM_NUM,
                        3,
                        this.channel,
                        param.uuid,
                        0,
                        IAtrType.STRING,
                        bufferedValue.length,
                        ...bufferedValue
                    ]
                })
            ]
        })
    }
}