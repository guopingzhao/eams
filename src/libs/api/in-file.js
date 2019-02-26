import {ARCHIVES, post} from "./index"

const pigeonhole = `${ARCHIVES}pigeonhole/`

export function getNumAPI () {
    return post(`${pigeonhole}num`, JSON.stringify())
}

export function listAPI (query) {
    return post(`${pigeonhole}pigeonholeList`, JSON.stringify(query))
}

export function moreAPI (id) {
    return post(`${pigeonhole}detail/${id}`)
}

export function passAPI (ids) {
    return post(`${pigeonhole}pass`, JSON.stringify(ids))
}

export function rejectAPI (ids) {
    return post(`${pigeonhole}reject`, JSON.stringify(ids))
}

export function inFileAPI (obj) {
    return post(`${pigeonhole}pigeonhole`, JSON.stringify(obj))
}