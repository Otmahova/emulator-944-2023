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
exports.tcp = void 0;
const net_1 = require("net");
require('dotenv').config();
const services_1 = require("./services");
const config_1 = require("./config");
const types_1 = require("./types");
const udp_1 = require("./udp");
exports.tcp = new net_1.Socket();
const m4Service = new services_1.M4Service(exports.tcp, udp_1.udp);
const dbService = new services_1.DBService();
exports.tcp.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    m4Service.initialize()
        .then(() => console.log('>>> tcp connected successfully'))
        .catch(console.error);
}));
exports.tcp.on('data', data => {
    console.log('>>> recived tcp data', data);
    const parsedData = m4Service.parseMessage(data);
    switch (parsedData.fncByte) {
        case types_1.IFncType.READ: {
            Object.keys(parsedData.dataChains).map((chainKey, idx) => __awaiter(void 0, void 0, void 0, function* () {
                yield dbService.syncParam({
                    where: { uuid: idx + 9 },
                    data: {
                        uuid: idx + 9,
                        value: parsedData.dataChains[chainKey],
                        isOperative: false,
                    }
                });
            }));
            break;
        }
    }
});
exports.tcp.on('end', () => {
    console.log('>>> tcp connection closed');
    setTimeout(() => {
        exports.tcp.destroy();
        exports.tcp.connect({
            host: config_1.HOST,
            port: config_1.PORT
        });
    }, 3000);
});
exports.tcp.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
        console.log('>>> tcp reconnection errored');
        setTimeout(() => {
            exports.tcp.destroy();
            exports.tcp.connect({
                host: config_1.HOST,
                port: config_1.PORT
            });
        }, 3000);
    }
});
exports.tcp.connect({
    host: config_1.HOST,
    port: config_1.PORT
});
