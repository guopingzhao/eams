let powers = []
export function setPowers (ids) {
    powers = ids
}
export function auth (power) {
    return powers.length && powers.some((v) => v === power)
}
export function getPowers () {
    return powers
}