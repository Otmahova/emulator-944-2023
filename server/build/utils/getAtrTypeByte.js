"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAtrTypeByte = void 0;
const types_1 = require("../types");
const data_1 = require("../data");
const getAtrTypeByte = (fncType) => {
    return data_1.atrTypeDictionary[fncType]
        ? data_1.atrTypeDictionary[fncType]
        : types_1.IAtrType.NONE;
};
exports.getAtrTypeByte = getAtrTypeByte;
