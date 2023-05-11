import { IFncType } from "../types"
import { fncTypeDictionary } from "../data"

export const getFncTypeByte = (fncType: IFncType) => {
    return fncTypeDictionary[fncType]
        ? fncTypeDictionary[fncType]
        : IFncType.NONE
}