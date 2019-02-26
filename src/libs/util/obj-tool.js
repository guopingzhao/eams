export function read(obj = {}, pathStr = "", options = {}) {
    const { reduce, defaultValue, isTrue, isArray } = options
    if (!pathStr) return obj
    if (Array.isArray(pathStr)) {
        let values = isArray ? [] : undefined
        for (let v of pathStr) {
            if (reduce) {
                values[v] = readObj(obj, `${v}`, defaultValue, isTrue)
            } else if (isArray) {
                values.push(readObj(obj, `${v}`, defaultValue, isTrue))
            } else {
                values = writeObj(values, `${v}`, readObj(obj, `${v}`, defaultValue, isTrue))
            }
        }
        return values
    } else {
        return objFindOne(obj, pathStr, defaultValue, isTrue)
    }
}

export function write(obj, pathStr = "", value, options = {}) {
    const { reduce } = options
    let newObj = obj
    if (Array.isArray(pathStr)) {
        for (let v of pathStr) {
            newObj = writeObj(newObj, `${v}`, read(value || {}, `${v}`), reduce)
        }
        return newObj
    } else {
        return writeObj(newObj, pathStr, value, reduce)
    }
}

export function del(obj = {}, pathStr = "", options = {}) {
    let newObj = Object.assign(Array.isArray(obj) ? [] : {}, obj)
    if (Array.isArray(pathStr)) {
        let paths = pathStr.map(v => v.split(/\.(?=[^.]*$)/)),
            v = newObj
        for (let i = 0, len = paths.length; i < len; i++) {
            v = delOne(v, paths[i], options)
        }
        return v
    } else {
        let pathline = pathStr.split(/\.(?=[^.]*$)/)
        return delOne(newObj, pathline, options)
    }
}

export function getPath(obj, key) {
    let regex = new RegExp(`\\.?${key}$`)
    let paths = []
    paths = getAllPath(obj, key).reduce((a, b) => {
        if (regex.test(b)) {
            return a.concat(b)
        } else {
            return a
        }
    }, [])
    return paths.length > 1 ? paths : paths[0]
}

export function assign(...objs) {
    let newObj
    for (let v of objs) {
        newObj = write(newObj, getAllPath(v), v)
    }
    return newObj
}

export function shallowAssign(...objs) {
    let newObj
    for (let v of objs) {
        newObj = write(newObj, Object.keys(v), v)
    }
    return newObj
}

export function merge(obj, pathStr = "", mergeValue) {
    let newObj = Object.assign(Array.isArray(obj) ? [] : {}, obj)
    if (Array.isArray(pathStr)) {
        for (let v of pathStr) {
            newObj = mergeObj(newObj, `${v}`, read(mergeValue, `${v}`))
        }
        return newObj
    } else {
        return mergeObj(newObj, pathStr, mergeValue)
    }
}

function mergeObj(obj, pathStr = "", mergeValue) {
    let result = read(obj, pathStr)
    if (Array.isArray(result)) {
        result = result.concat(mergeValue)
    } else if (/Object]$/.test(Object.prototype.toString.call(result))) {
        result = Object.assign(result, mergeValue)
    } else {
        result = mergeValue
    }
    return write(obj, pathStr, result)
}
function objFindOne (obj = {}, pathStr, defaultValue, isTrue) {
    if (obj.hasOwnProperty(pathStr)) return obj[pathStr]
    let [key, nKey] = pathStr.replace(/([^.]*)\.(.*)/, "$1 $2").split(" ")
    let value = obj[key]
    if (nKey && value) {
        return readObj(value, nKey, defaultValue)
    }
    return isTrue ? value || defaultValue : value
}
function readObj(obj = {}, pathStr, defaultValue, isTrue) {
    if (obj.hasOwnProperty(pathStr)) return obj[pathStr]
    let pathline = pathStr.split(".")
    let value = obj[pathline.shift()],
        isKey = false
    for (let i = 0, len = pathline.length; i < len; i++) {
        if (value) {
            if (value.hasOwnProperty) {
                isKey = value.hasOwnProperty(pathline[i])
            }
            value = value[pathline[i]]
        } else {
            return defaultValue || value
        }
    }
    if (isTrue) {
        return value || defaultValue
    }
    return !value && !isKey ? defaultValue : value
}

function writeObj(obj, pathStr, value, reduce) {
    let pathline = pathStr.split("."),
        newObj = Object.assign(
            obj
                ? Array.isArray(obj) ? [] : {}
                : /^\d*$/.test(pathline[0]) ? [] : {}
            ,
            obj
        )
    if (newObj[pathStr] || reduce) {
        newObj[pathStr] = value
        return newObj
    }

    let v = newObj,
        len = pathline.length - 1
    for (let i = 0; i < len; i++) {
        if (v) {
            if (v[pathline[i]]) {
                v = v[pathline[i]]
            } else {
                v[pathline[i]] = /^\d*$/.test(pathline[i + 1]) ? [] : {}
                v = v[pathline[i]]
            }
        }
    }
    v[pathline[len]] = value
    return newObj
}

function delOne(obj, [a, b], options) {
    let {
        isFill = false,
        fillValue
    } = options
    let v = obj
    let copyb = b
    if (b) {
        v = read(obj, a)
    } else {
        b = a
    }
    let newV = Array.isArray(v) ? [...v] : {...v}
    if (Array.isArray(newV)) {
        if (newV[b]) {
            if (isFill) {
                newV.splice(b, 1, fillValue)
            } else {
                newV.splice(b, 1)
            }
        }
    } else if (isFill) {
        delete newV[b]

    } else {
        newV[b] = fillValue
    }
    if (copyb) {
        return write(obj, a, newV)
    } else {
        return newV
    }
}

function getAllPath(obj, key, parentKey = "") {
    let newObj = Object.assign(Array.isArray(obj) ? [] : {}, obj),
        keyPath = [],
        isfor = false
    for (let [k, v] of Object.entries(newObj)) {
        isfor = true
        let childKey
        if (k === key) {
            childKey = `${parentKey}${k}`
        } else if (typeof v === "object") {
            childKey = `${getAllPath(v, key, `${parentKey}${k}.`)}`
        } else {
            childKey = `${parentKey}${k}`
        }
        if (childKey) keyPath.push(childKey)
    }

    if (!isfor) {
        keyPath.push(`${parentKey}`.replace(/\.$/, ""))
    }

    return keyPath.join().split(",").filter(v => v)
}