"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fncTypeDictionary = void 0;
const types_1 = require("../types");
exports.fncTypeDictionary = {
    0x00: types_1.IFncType.NONE,
    0x21: types_1.IFncType.ERROR,
    0x3f: types_1.IFncType.INITIAL,
    0x72: types_1.IFncType.READ,
    0x77: types_1.IFncType.WRITE,
};
