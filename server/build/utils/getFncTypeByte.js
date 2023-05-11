"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFncTypeByte = void 0;
const types_1 = require("../types");
const data_1 = require("../data");
const getFncTypeByte = (fncType) => {
    return data_1.fncTypeDictionary[fncType]
        ? data_1.fncTypeDictionary[fncType]
        : types_1.IFncType.NONE;
};
exports.getFncTypeByte = getFncTypeByte;
