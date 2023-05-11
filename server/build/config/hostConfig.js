"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOST = exports.PORT = void 0;
exports.PORT = +process.env.PORT || 5050;
exports.HOST = process.env.HOST || 'localhost';
