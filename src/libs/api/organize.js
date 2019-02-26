import {BASE, post} from "./index"

const organize = `${BASE}department`

export function gettree () {
    return post(`${organize}/getAllDepartmentForTree`)
}

export function list () {
    return post(`${organize}/getAllDepartment`)
}

export function dele (id) {
    return post(`${organize}/deleteDepartment/${id}`)
}

export function getCurTree (id) {
    return post(`${organize}/getFatherDepartment/${id}`)
}

export function add (info) {
    return post(`${organize}/addDepartment`, JSON.stringify(info))
}

export function update (info) {
    return post(`${organize}/updateDepartment`, JSON.stringify(info))
}