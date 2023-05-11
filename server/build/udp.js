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
exports.udp = void 0;
const dgram = require("dgram");
const types_1 = require("./types");
const services_1 = require("./services");
const tcp_1 = require("./tcp");
const config_1 = require("./config");
exports.udp = dgram.createSocket("udp4");
const m4Service = new services_1.M4Service(tcp_1.tcp, exports.udp);
const dbService = new services_1.DBService();
exports.udp.on('listening', () => {
    const { address, port } = exports.udp.address();
    console.log(`>>> udp opened at ${address}:${port}`);
    exports.udp.on("message", (data, info) => {
        const { address, port } = info;
        console.log('>>> recieved udp data ', data);
        const parsedData = m4Service.parseMessage(data);
        switch (parsedData.fncByte) {
            case types_1.IFncType.READ: {
                Object.keys(parsedData.dataChains).map((chainKey, idx) => __awaiter(void 0, void 0, void 0, function* () {
                    yield dbService.syncParam({
                        where: { uuid: idx + config_1.EXPECTED_IDS[0] },
                        data: {
                            uuid: idx + config_1.EXPECTED_IDS[0],
                            value: parsedData.dataChains[chainKey],
                            isOperative: false,
                        }
                    });
                }));
                break;
            }
        }
    });
});
//On error event display error
exports.udp.on('error', (error) => {
    console.log('>>> udp error: ' + error.stack);
    exports.udp.close();
    setTimeout(() => {
        exports.udp.connect(config_1.PORT, config_1.HOST);
    }, 3000);
});
exports.udp.bind(10000);
