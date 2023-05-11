"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcKC8 = void 0;
const calcKC8 = (bytes) => {
    return parseInt(bytes.map(i => +i.toString())
        .reduce((a, b) => a + b)
        .toString(2)
        .replace(/1/g, '_')
        .replace(/0/g, '1')
        .replace(/_/g, '0'), 2);
};
exports.calcKC8 = calcKC8;
