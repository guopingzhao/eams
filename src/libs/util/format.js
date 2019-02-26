export function phone(phone="") {
    return phone.replace(/^(.{3}).*(.{4})$/, "$1****$2")
}

export function money (number, option={}) {
    const {fixed = 2, splitStr = ",", splitNum = 3} = option
    let num = +number / 100
    let [int, float] = `${num.toFixed(fixed)}`.split(".")
    let isAdd = 1
    return `${int.split("").reduceRight((a, b, i) => {
        if (isAdd === splitNum && i) {
            isAdd = 1
            return `${splitStr}${b}${a}`
        } else {
            isAdd++
            return `${b}${a}`
        }
    }, "")}${fixed ? "." : ""}${float || ""}`
}