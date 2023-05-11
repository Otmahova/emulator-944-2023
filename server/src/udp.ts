import * as dgram from "dgram"

import { IFncType } from "./types"
import { DBService, M4Service } from "./services"
import { tcp } from "./tcp"
import { EXPECTED_IDS, HOST, PORT } from "./config";

export const udp = dgram.createSocket("udp4")

const m4Service = new M4Service(tcp, udp)
const dbService = new DBService()

udp.on('listening', () => {
    const { address, port } = udp.address()
    console.log(`>>> udp opened at ${address}:${port}`)
    udp.on("message", (data, info) => {
        const { address, port } = info
        console.log('>>> recieved udp data ', data)
        const parsedData = m4Service.parseMessage(data)
        switch (parsedData.fncByte) {
            case IFncType.READ: {
                Object.keys(parsedData.dataChains).map(async (chainKey, idx) => {
                    await dbService.syncParam({
                        where: { uuid: idx + EXPECTED_IDS[0] },
                        data: {
                            uuid: idx + EXPECTED_IDS[0],
                            value: parsedData.dataChains[chainKey],
                            isOperative: false,
                        }
                    })
                })
                break
            }
        }
    })
});

//On error event display error
udp.on('error', (error) => {
    console.log('>>> udp error: ' + error.stack);
    udp.close();
    setTimeout(() => {
        udp.connect(PORT, HOST)
    }, 3000)
});


udp.bind(10000)

