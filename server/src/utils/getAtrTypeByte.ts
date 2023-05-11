import { IAtrType, IFncType } from "../types"
import { atrTypeDictionary, fncTypeDictionary } from "../data"

export const getAtrTypeByte = (fncType: IAtrType) => {
    return atrTypeDictionary[fncType]
        ? atrTypeDictionary[fncType]
        : IAtrType.NONE
}