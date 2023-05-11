export const calcKC8 = (bytes: number[]) => {
    return parseInt(bytes.map(i => +i.toString())
        .reduce((a, b) => a + b)
        .toString(2)
        .replace(/1/g, '_')
        .replace(/0/g, '1')
        .replace(/_/g, '0'), 2)
}
