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
exports.M4Service = void 0;
const types_1 = require("../types");
const utils_1 = require("../utils");
const data_1 = require("../data");
const config_1 = require("../config");
class M4Service {
    constructor(tcpSocket, udpSocket, timeout = 3000) {
        this.isTCP = process.env.TCP === "1";
        this.channel = 0;
        this.send = (msg, cb) => {
            if (!this.isTCP) {
                return this._udp.send(msg, config_1.PORT, config_1.HOST, cb);
            }
            return this._tcp.write(msg, cb);
        };
        this.sendMessage = (msg, cb) => {
            let payload = [];
            msg.data.forEach(chain => {
                chain.forEach(byte => {
                    payload.push(byte);
                });
            });
            const bodyLength = (1 + payload.length).toString(16);
            let dl1 = 0, dl2 = 0;
            if (bodyLength.length === 2 || bodyLength.length === 1) {
                dl1 = parseInt(bodyLength, 16);
            }
            else if (bodyLength.length === 3) {
                dl1 = parseInt(bodyLength[0], 16);
                dl2 = parseInt(bodyLength.slice(1), 16);
            }
            else if (bodyLength.length === 4) {
                dl1 = parseInt(bodyLength.slice(0, 2), 16);
                dl2 = parseInt(bodyLength.slice(3), 16);
            }
            const crc = (0, utils_1.calcCRC)(Buffer.from([
                0xFF,
                0x90,
                msg.id,
                0x00,
                dl1,
                dl2,
                msg.fnc,
                ...payload,
            ])).toString(16);
            const crc1 = parseInt(crc.slice(0, 2), 16);
            const crc2 = parseInt(crc.slice(2), 16);
            const data = Buffer.from([
                0x10,
                0xFF,
                0x90,
                msg.id,
                0x00,
                dl1,
                dl2,
                msg.fnc,
                ...payload,
                crc1,
                crc2
            ]);
            console.log(`>>> send ${process.env.TCP === '1' ? 'tcp' : 'udp'} data = `, data);
            return this.send(data, cb);
        };
        this.parseMessage = (msg) => {
            const msgBytes = msg.map(i => +i);
            let payloadBytes = msgBytes.slice(2, -2);
            let fncByte = payloadBytes[0];
            if (msgBytes[2] === 0x90) {
                payloadBytes = msgBytes.slice(7, -2);
                fncByte = payloadBytes[0];
            }
            let dataBytes = payloadBytes.slice(1);
            const chainsHash = {};
            let id = 0;
            while (id < dataBytes.length) {
                const byte = dataBytes[id];
                const isHeadByte = !!data_1.atrTypeDictionary[byte];
                if (isHeadByte && dataBytes[id + 1]) {
                    const chainLength = +dataBytes[id + 1];
                    const data = dataBytes.slice(id + 2, id + 1 + chainLength + 1);
                    let dataString = '';
                    data.forEach(dataItem => dataString += dataItem.toString(16));
                    chainsHash[byte.toString(16) + '-' + id] = (0, utils_1.hexToString)(dataString);
                    id = id + 1 + chainLength + 1;
                }
            }
            return {
                dataChains: chainsHash,
                fncByte: fncByte,
            };
        };
        this.initialize = () => __awaiter(this, void 0, void 0, function* () {
            const initialMsg = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]);
            this.send(initialMsg);
            setTimeout(() => {
                const startMsg = Buffer.from([0x10, 0xFF, 0x3F, 0x00, 0x00, 0x00, 0x00, 0xC1, 0x16]);
                this.send(startMsg);
            }, this._timeout);
        });
        this.getParams = (msgId, paramIds) => __awaiter(this, void 0, void 0, function* () {
            return this.sendMessage({
                id: msgId,
                fnc: types_1.IFncType.READ,
                data: [
                    ...paramIds.map(id => {
                        return [types_1.IAtrType.PARAM_NUM, 3, this.channel, id, 0];
                    })
                ]
            });
        });
        this.setParams = (msgId, params) => __awaiter(this, void 0, void 0, function* () {
            return this.sendMessage({
                id: msgId,
                fnc: types_1.IFncType.WRITE,
                data: [
                    ...params.filter(i => config_1.EXPECTED_IDS.includes(i.uuid)).map(param => {
                        const bufferedValue = Buffer.from(param.value);
                        return [
                            types_1.IAtrType.PARAM_NUM,
                            3,
                            this.channel,
                            param.uuid,
                            0,
                            types_1.IAtrType.STRING,
                            bufferedValue.length,
                            ...bufferedValue
                        ];
                    })
                ]
            });
        });
        this._timeout = timeout;
        this._tcp = tcpSocket;
        this._udp = udpSocket;
    }
}
exports.M4Service = M4Service;
