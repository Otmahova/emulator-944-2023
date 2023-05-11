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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const fast_xml_parser_1 = require("fast-xml-parser");
const services_1 = require("./services");
const config_1 = require("./config");
const sequalize_1 = require("./sequalize");
sequalize_1.sequelize;
const dbService = new services_1.DBService();
const parser = new fast_xml_parser_1.XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: ''
});
const data = parser.parse(fs.readFileSync('./dataset.xml'));
Promise.allSettled([...(_b = (_a = data === null || data === void 0 ? void 0 : data.Channel) === null || _a === void 0 ? void 0 : _a.Item) === null || _b === void 0 ? void 0 : _b.map((i) => __awaiter(void 0, void 0, void 0, function* () {
        const item = i;
        const uuid = +item.Ordinal;
        if (isNaN(uuid))
            return;
        if (uuid >= config_1.EXPECTED_IDS[0] && uuid <= config_1.EXPECTED_IDS[config_1.EXPECTED_IDS.length - 1]) {
            yield dbService.syncParam({
                where: { uuid: +item.Ordinal },
                data: {
                    uuid: +item.Ordinal,
                    value: item.Value,
                    metric: item.Eu,
                    name: item.Name,
                    isOperative: false
                }
            });
        }
    }))])
    .then(() => console.log('[success] db prepared!'));
