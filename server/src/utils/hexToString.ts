export const hexToString = (hex: string) => {
    hex = hex.replace(' ', '')
    let result = ''
    for (let i = 0; i < hex.length; i += 2)
        result += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    return result
}
