export const calcCRC = (message: Buffer) => {
    let crc = 0
    const polynomial = 0x1021
    for (const b of message) {
        for (let i = 0; i < 8; i++) {
            const bit = ((b >> (7 - i) & 1) === 1)
            const c15 = ((crc >> 15 & 1) === 1)
            crc <<= 1
            if (c15 !== bit) crc ^= polynomial
        }
    }
    crc &= 0xFFFF
    return crc
}