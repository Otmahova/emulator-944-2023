import { IAtrType } from "../types"

export const atrTypeDictionary = {
    0x00: IAtrType.NONE,
    0x04: IAtrType.RESPONSE_LIST,
    0x05: IAtrType.NULL,
    0x16: IAtrType.STRING,
    0x30: IAtrType.SEQUENCE,
    0x41: IAtrType.UNSIGNED_INT,
    0x42: IAtrType.INT,
    0x43: IAtrType.FLOAT,
    0x44: IAtrType.INT_FLOAT,
    0x45: IAtrType.OPERATION_BD,
    0x46: IAtrType.CONFIRMATION,
    0x47: IAtrType.CURRENT_TIME,
    0x48: IAtrType.CURRENT_DATE,
    0x49: IAtrType.ARCHIVE_DATE,
    0x4A: IAtrType.PARAM_NUM,
    0x4B: IAtrType.FLAGS,
    0x55: IAtrType.ERROR,
}