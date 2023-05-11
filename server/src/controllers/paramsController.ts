import { Request, Response } from "express"

import { DBService, M4Service } from "../services"
import { IParam } from "../types";
import { tcp } from "../tcp"
import { udp } from "../udp"
import { EXPECTED_IDS } from "../config";

const dbService = new DBService()
const m4Service = new M4Service(tcp, udp, 3000)

export class ParamsController {
    syncAll = async (req: Request, res: Response) => {
        try {
            if (tcp.readyState !== 'open') return res.json({
                data: null,
                msg: 'Соединение нарушено!'
            })
            m4Service.getParams(0, EXPECTED_IDS)

            const paramsList = await dbService.getParams()
            setTimeout(() => {
                return res.json({
                    data: paramsList.map(i => i.toJSON()),
                    msg: 'ok'
                })
            }, 2000)
        } catch (e) {
            return res.json({
                data: null,
                msg: e.toString()
            })
        }
    }
    getAll = async (req: Request, res: Response) => {
        try {
            const paramsList = await dbService.getParams()
            return res.json({
                data: paramsList.map(i => i.toJSON()),
                msg: 'ok'
            })
        } catch (e) {
            return res.json({
                data: [],
                msg: e.toString()
            })
        }
    }
    getOne = async (req: Request, res: Response) => {
        try {
            const id = +(req.params.id || 0) || 0
            const paramsList = await dbService.getParam({
                uuid: id
            })
            res.json(paramsList)

        } catch (e) {
            return res.json({
                data: null,
                msg: e.toString()
            })
        }
    }
    updateAll = async (req: Request, res: Response) => {
        const { params }: { params: IParam[] } = req.body
        try {
            m4Service.setParams(1, params)
            return res.json({
                data: null,
                msg: 'ok'
            })

        } catch (e) {
            return res.json({
                data: null,
                msg: e.toString()
            })
        }
    }

}