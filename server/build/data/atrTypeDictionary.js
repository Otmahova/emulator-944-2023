"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atrTypeDictionary = void 0;
const types_1 = require("../types");
exports.atrTypeDictionary = {
    0x00: types_1.IAtrType.NONE,
    0x04: types_1.IAtrType.RESPONSE_LIST,
    0x05: types_1.IAtrType.NULL,
    0x16: types_1.IAtrType.STRING,
    0x30: types_1.IAtrType.SEQUENCE,
    0x41: types_1.IAtrType.UNSIGNED_INT,
    0x42: types_1.IAtrType.INT,
    0x43: types_1.IAtrType.FLOAT,
    0x44: types_1.IAtrType.INT_FLOAT,
    0x45: types_1.IAtrType.OPERATION_BD,
    0x46: types_1.IAtrType.CONFIRMATION,
    0x47: types_1.IAtrType.CURRENT_TIME,
    0x48: types_1.IAtrType.CURRENT_DATE,
    0x49: types_1.IAtrType.ARCHIVE_DATE,
    0x4A: types_1.IAtrType.PARAM_NUM,
    0x4B: types_1.IAtrType.FLAGS,
    0x55: types_1.IAtrType.ERROR,
};
