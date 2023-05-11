"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamsController = void 0;
const services_1 = require("../services");
const tcp_1 = require("../tcp");
const udp_1 = require("../udp");
const config_1 = require("../config");
const dbService = new services_1.DBService();
const m4Service = new services_1.M4Service(tcp_1.tcp, udp_1.udp, 3000);
class ParamsController {
    constructor() {
        this.syncAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (tcp_1.tcp.readyState !== 'open')
                    return res.json({
                        data: null,
                        msg: 'Соединение нарушено!'
                    });
                m4Service.getParams(0, config_1.EXPECTED_IDS);
                const paramsList = yield dbService.getParams();
                setTimeout(() => {
                    return res.json({
                        data: paramsList.map(i => i.toJSON()),
                        msg: 'ok'
                    });
                }, 2000);
            }
            catch (e) {
                return res.json({
                    data: null,
                    msg: e.toString()
                });
            }
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const paramsList = yield dbService.getParams();
                return res.json({
                    data: paramsList.map(i => i.toJSON()),
                    msg: 'ok'
                });
            }
            catch (e) {
                return res.json({
                    data: [],
                    msg: e.toString()
                });
            }
        });
        this.getOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +(req.params.id || 0) || 0;
                const paramsList = yield dbService.getParam({
                    uuid: id
                });
                res.json(paramsList);
            }
            catch (e) {
                return res.json({
                    data: null,
                    msg: e.toString()
                });
            }
        });
        this.updateAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { params } = req.body;
            try {
                m4Service.setParams(1, params);
                return res.json({
                    data: null,
                    msg: 'ok'
                });
            }
            catch (e) {
                return res.json({
                    data: null,
                    msg: e.toString()
                });
            }
        });
    }
}
exports.ParamsController = ParamsController;
