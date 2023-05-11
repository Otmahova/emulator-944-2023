import * as fs from "fs"
import { XMLParser } from 'fast-xml-parser'

import { DBService } from "./services"
import { EXPECTED_IDS } from "./config"
import { sequelize } from "./sequalize"

sequelize

const dbService = new DBService()
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: ''
})

const data = parser.parse(fs.readFileSync('./dataset.xml'))
Promise.allSettled([...data?.Channel?.Item?.map(async i => {
    const item: {
        Ordinal: string,
        Name: string,
        Eu: string,
        Value: string
    } = i
    const uuid = +item.Ordinal
    if (isNaN(uuid)) return
    if (uuid >= EXPECTED_IDS[0] && uuid <= EXPECTED_IDS[EXPECTED_IDS.length - 1]) {
        await dbService.syncParam({
            where: { uuid: +item.Ordinal },
            data: {
                uuid: +item.Ordinal,
                value: item.Value,
                metric: item.Eu,
                name: item.Name,
                isOperative: false
            }
        })
    }
}) ])
    .then(() => console.log('[success] db prepared!'))