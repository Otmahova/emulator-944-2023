"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamModel = void 0;
const sequelize_1 = require("sequelize");
const sequalize_1 = require("../sequalize");
exports.ParamModel = sequalize_1.sequelize.define('Param', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uuid: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    name: sequelize_1.DataTypes.STRING,
    metric: sequelize_1.DataTypes.STRING,
    value: sequelize_1.DataTypes.STRING,
    isOperative: sequelize_1.DataTypes.BOOLEAN
}, {
    timestamps: false
});
