import { DataTypes, Model } from "sequelize"

import { sequelize } from "../sequalize"
import { IParam } from "../types"

type ParamModelInstance = Model<IParam, Omit<IParam, 'id'>>
export const ParamModel = sequelize.define<ParamModelInstance>('Param', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uuid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: DataTypes.STRING,
    metric: DataTypes.STRING,
    value: DataTypes.STRING,
    isOperative: DataTypes.BOOLEAN
}, {
    timestamps: false
})
