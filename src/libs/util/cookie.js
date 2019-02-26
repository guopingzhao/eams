export function setCookie(cname, cvalue, options={}) {
    const {exdays, path="/"} = options
    let d = new Date()
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
    let expires = `expires=${d.toGMTString()}`
    document.cookie = `${cname}=${cvalue}; ${expires}; path=${path}`
}

export function getCookie(cname) {
    let result
    let reg = new RegExp(`.*${cname}=([^;]+).*`, "mg")
    document.cookie.replace(reg, (a, b) => result = b)
    return result
}

export function getAllCookie() {
    let cookieStr = document.cookie
    return cookieStr.split(";")
        .map((v) => v.replace(/^\s/, "").split("="))
        .reduce((x, y) => {
            let [k, v] = y
            x[k] = v
            return x
        }, {})
}

export function clearCookie(cname) {
    if (cname) {
        if (Array.isArray(cname)) {
            cname.forEach((v) => {
                setCookie(v, "", {exdays: 0})
            })
        } else {
            setCookie(cname, "", {exdays: 0})
        }
    } else {
        let cookieStr = document.cookie
        cookieStr.split(";")
            .map((v) => v.replace(/^\s/, "").split("="))
            .forEach(([k]) => {
                setCookie(k, "", {exdays: 0})
            })
    }
}